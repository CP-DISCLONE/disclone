from django.shortcuts import get_object_or_404, get_list_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import HttpRequest
from rest_framework.status import (
    HTTP_200_OK,
    HTTP_201_CREATED,
    HTTP_204_NO_CONTENT,
    HTTP_400_BAD_REQUEST,
    HTTP_404_NOT_FOUND
)
import json
from .models import Server, Channel, Message
from user_app.models import User
from user_app.serializers import UserSerializer
from .serializers import ServerOnlySerializer, ChannelSerializer, MessageSerializer, GetMessageSerializer, ServerSerializer, ChannelOnlySerializer
from user_app.views import TokenReq
from datetime import datetime


class All_servers(TokenReq):
    """The view that holds the methods to get all Server data or create a new Server.

    Args:
        TokenReq (class): Permissions and base class to create the view.
    """

    def get(self, request: HttpRequest) -> Response:
        """Gets all relevant Server data and returns it to the frontend.

        Args:
            request (HttpRequest): The request from the frontend with proper authorization header.

        Returns:
            Response: The rest_framework HTTP response with data and proper status code.
        """

        servers = get_list_or_404(request.user.servers.all())
        ser_servers = ServerOnlySerializer(servers, many=True)
        return Response(ser_servers.data, status=HTTP_200_OK)

    def post(self, request: HttpRequest) -> Response:
        """Creates a new Server with valid data.

        Args:
            request (HttpRequest): The request from the frontend with data and proper authorization header.

        Returns:
            Response: The rest_framework HTTP response with data and proper status code.
        """

        data = request.data.copy()
        data['admin'] = request.user.id
        data['users'] = [request.user.id]
        new_server = ServerSerializer(data=data)
        if new_server.is_valid():
            new_server.save()
            _response = new_server.data
            _response['admin'] = UserSerializer(
                get_object_or_404(User, id=_response['admin'])).data
            users_queryset = User.objects.filter(id__in=_response['users'])
            _response['users'] = UserSerializer(users_queryset, many=True).data
            return Response(_response, status=HTTP_201_CREATED)
        return Response(new_server.errors, status=HTTP_400_BAD_REQUEST)


class A_server(TokenReq):
    """The view that holds the methods get a Server's data, update a Server, or delete a Server.

    Args:
        TokenReq (class): Permissions and base class to create the view.
    """

    def add_channels(self, server: Server, lst_of_channel_ids: list[int]) -> None:
        """Updates a Server object with the Channel ids provided.

        Args:
            server (Server): The Server to be updated.
            lst_of_channel_ids (list[int]): The list of Channel ids.
        """

        for channel_id in lst_of_channel_ids:
            if get_object_or_404(Channel, id=channel_id):
                server.channels.add(channel_id)
                server.save()

    def get_server(self, request: HttpRequest, server_id: int) -> Server | None:
        """Gets a User's stored Server object.

        Args:
            request (HttpRequest): The request from the frontend with data and proper authorization header.
            server_id (int): The Server's id.

        Returns:
            Server | None: If the Server exists in the User's list of Servers, returns the Server object. If not, None is returned.
        """

        return get_object_or_404(request.user.servers, id=server_id)

    def get(self, request: HttpRequest, server_id: int) -> Response:
        """Gets the data for the specified Server.

        Args:
            request (HttpRequest): The request from the frontend with data and proper authorization header.
            server_id (int): The Server's id.

        Returns:
            Response: The rest_framework HTTP response with data and proper status code.
        """
        server = self.get_server(request, server_id)
        if server:
            admin_user = server.admin  # Admin user is already fetched by the server.admin field

            # Fetch user objects associated with the server
            users = server.users.all()

            server_data = ServerSerializer(server).data
            admin_data = UserSerializer(admin_user).data
            users_data = [UserSerializer(user).data for user in users]

            server_data['admin'] = admin_data
            server_data['users'] = users_data

            return Response(server_data, status=HTTP_200_OK)
        else:
            return Response({"message": "Server not found"}, status=HTTP_404_NOT_FOUND)

    def put(self, request: HttpRequest, server_id: int, method: str = None) -> Response:
        """Updates a Server's information.

        If the User making the request is the administrator of the Server, then they can update any Server data.
        Otherwise, if the User making the request is not the administrator, they can only add or remove 
        themselves to the Server's user list.

        Args:
            request (HttpRequest): The request from the frontend with data and proper authorization header.
            server_id (int): The Server's id.
            method (str, optional): The specified method of add or subtract. Defaults to None.

        Returns:
            Response: The rest_framework HTTP response with data and proper status code.
        """

        data = request.data.copy()
        print(type(server_id))
        curr_server = get_object_or_404(Server, id=server_id)
        print(curr_server)
        if not method and request.user.id == curr_server.admin.id:
            ser_server = ServerSerializer(curr_server, data=data, partial=True)
            if ser_server.is_valid():
                ser_server.save()
                if data.get("admin"):
                    print('test1')
                    server = get_object_or_404(Server, id=server_id)
                    server.admin = data.get("admin")
                    server.full_clean()
                    server.save()
                if data.get("lst_of_channels"):
                    self.add_channels(server=get_object_or_404(
                        Server, id=server_id), lst_of_channel_ids=data.get("lst_of_channels"))
                return Response(ser_server.data, status=HTTP_200_OK)
            return Response(ser_server.errors, status=HTTP_400_BAD_REQUEST)
        elif method == 'add':
            curr_user = get_object_or_404(User, id=request.user.id)
            curr_server_users = curr_server.users.all()
            if curr_user not in curr_server_users:
                curr_server.users.add(curr_user)
                curr_server.full_clean()
                curr_server.save()
                return Response("Successfully added user", status=HTTP_200_OK)
            else:
                return Response("User already in server", status=HTTP_400_BAD_REQUEST)
        elif method == 'subtract':
            server = get_object_or_404(Server, id=server_id)
            user = get_object_or_404(User, id=request.user.id)
            if user in server.users.all():
                server.users.remove(user)
                return Response("Successfully removed user", status=HTTP_200_OK)
            else:
                return Response("Failed to remove user", HTTP_400_BAD_REQUEST)

    def delete(self, request: HttpRequest, server_id: int) -> Response:
        """Deletes a Server.

        Args:
            request (HttpRequest): The request from the frontend with data and proper authorization header.
            server_id (int): The Server's id.

        Returns:
            Response: The rest_framework HTTP response with data and proper status code.
        """

        curr_server = self.get_server(request, server_id)
        if request.user.id == curr_server.admin.id:
            curr_server.delete()
            return Response(status=HTTP_204_NO_CONTENT)
        return Response(json.dumps({'Error': 'User is not the current server admin'}), status=HTTP_400_BAD_REQUEST)


class All_channels(TokenReq):
    """The view that holds the methods to get all Channel data and create a new channel.

    Args:
        TokenReq (class): Permissions and base class to create the view.
    """

    def get(self, request: HttpRequest, server_id: int) -> Response:
        """Gets all relevant Channel data and returns it to the frontend.

        Args:
            request (HttpRequest): The request from the frontend with proper authorization header.
            server_id (int): The parent Server's id.

        Returns:
            Response: The rest_framework HTTP response with data and proper status code.
        """

        try:
            channels = ChannelOnlySerializer(
                request.user.servers.get(id=server_id).channels, many=True)
            return Response(channels.data, status=HTTP_200_OK)
        except Exception as e:
            return Response(e, status=HTTP_400_BAD_REQUEST)

    def post(self, request: HttpRequest, server_id: int) -> Response:
        """Creates a new Channel within the specified Server.

        Args:
            request (HttpRequest): The request from the front end with data and proper authorization header.
            server_id (int): The parent Server's id.

        Returns:
            Response: The rest_framework HTTP response with data and proper status code.
        """

        data = request.data.copy()
        curr_server = get_object_or_404(request.user.servers, id=server_id)
        data['server'] = server_id
        data['moderators'] = [request.user.id]
        if request.user.id == curr_server.admin.id:
            new_channel = ChannelSerializer(data=data)
            if new_channel.is_valid():
                new_channel.save()
                return Response(new_channel.data, status=HTTP_201_CREATED)
            return Response(new_channel.errors, status=HTTP_400_BAD_REQUEST)
        return Response(json.dumps({'Error': 'User is not the server admin'}), status=HTTP_400_BAD_REQUEST)


class A_channel(TokenReq):
    """The view that contains the methods to get the data for a specific Channel, update a Channel, or delete a Channel.

    Args:
        TokenReq (class): Permissions and base class to create the view.
    """

    def add_messages(self, channel: Channel, lst_of_message_ids: list[int]) -> None:
        """Adds Messages to a Channels list of Messages.

        Args:
            channel (Channel): The Channel to be updated.
            lst_of_message_ids (list[int]): The list of Message ids.
        """

        for message_id in lst_of_message_ids:
            if get_object_or_404(Message, id=message_id):
                channel.messages.add(message_id)
                channel.save()

    def get(self, request: HttpRequest, server_id: int, channel_id: int) -> Response:
        """Gets the data for a specific Channel.

        Args:
            request (HttpRequest): The request from the frontend with proper authorization header.
            server_id (int): The parent Server's id.
            channel_id (int): The Channel's id.

        Returns:
            Response: The rest_framework HTTP response with data and proper status code.
        """

        channel = ChannelSerializer(get_object_or_404(Channel, id=channel_id))
        return Response(channel.data, status=HTTP_200_OK)

    def put(self, request: HttpRequest, server_id: int, channel_id: int) -> Response:
        """Updates a Channel's information and/or messages.

        Args:
            request (HttpRequest): The request from the frontend with data and proper authorization header.
            server_id (int): The parent Server's id.
            channel_id (int): The Channel's id.

        Returns:
            Response: The rest_framework HTTP response with data and proper status code.
        """

        data = request.data.copy()
        channel = get_object_or_404(Channel, id=channel_id)
        if request.user.id in channel['moderators']:
            if data.get('lst_of_messages'):
                self.add_messages(
                    channel=channel, lst_of_message_ids=data.get('lst_of_messages'))
            ser_channel = ChannelSerializer(channel, data=data, partial=True)
            if ser_channel.is_valid():
                ser_channel.save()
                return Response(ser_channel.data, status=HTTP_200_OK)
            return Response(ser_channel.errors, status=HTTP_400_BAD_REQUEST)
        return Response(json.dumps({'Error': 'User is not a channel moderator'}), status=HTTP_400_BAD_REQUEST)

    def delete(self, request: HttpRequest, server_id: int, channel_id: int) -> Response:
        """Deletes a Channel.

        Args:
            request (HttpRequest): The request from the frontend with proper authorization header.
            server_id (int): The parent Server's id.
            channel_id (int): The Channel's id.

        Returns:
            Response: The rest_framework HTTP response with proper status code.
        """

        server = get_object_or_404(Server, id=server_id)
        channel = get_object_or_404(Channel, id=channel_id)
        if request.user.id == server.admin.id:
            channel.delete()
            return Response(status=HTTP_204_NO_CONTENT)
        return Response(json.dumps({'Error': 'User is not the server admin'}), status=HTTP_400_BAD_REQUEST)


class All_messages(TokenReq):
    """The view that holds the methods to get all Message data and create a new Message.

    Args:
        TokenReq (class): Permissions and base class to create the view.
    """

    def get(self, request: HttpRequest, server_id: int, channel_id: int) -> Response:
        """Gets all of a Channel's Messages and their data.

        Args:
            request (HttpRequest): The request from the frontend with proper authorization header.
            server_id (int): The ancestor Server's id.
            channel_id (int): The parent Channel's id.

        Returns:
            Response: The rest_framework HTTP response with data and proper status code.
        """

        channel = get_object_or_404(Channel, id=channel_id)
        messages = GetMessageSerializer(channel.messages, many=True)
        return Response(messages.data, status=HTTP_200_OK)

    def post(self, request: HttpRequest, server_id: int, channel_id: int) -> Response:
        """Creates a new Message.

        Args:
            request (HttpRequest): The request from the frontend with data and proper authorization header.
            server_id (int): The ancestor Server's id.
            channel_id (int): The parent Channel's id.

        Returns:
            Response: The rest_framework HTTP response with data and proper authorization header.
        """

        data = request.data.copy()
        data['channel'] = channel_id
        sender = get_object_or_404(User, display_name=data['sender'])
        data['sender'] = sender.id
        data['datetime'] = datetime.now()
        new_message = MessageSerializer(data=data)
        if new_message.is_valid():
            new_message.save()
            return Response(new_message.data, status=HTTP_201_CREATED)
        return Response(new_message.errors, status=HTTP_400_BAD_REQUEST)


class A_message(TokenReq):
    """The view that holds the methods to get a Message's data, update a Message, or delete a Message.

    Args:
        TokenReq (class): Permissions and base class to create the view.
    """

    def get(self, request: HttpRequest, server_id: int, channel_id: int, message_id: int) -> Response:
        """Gets the specified Message's data.

        Args:
            request (HttpRequest): The request from the frontend with proper authorization header.
            server_id (int): The ancestor Server's id.
            channel_id (int): The parent Channel's id.
            message_id (int): The Message's id.

        Returns:
            Response: The rest_framework HTTP response with data and proper status code.
        """

        message = MessageSerializer(get_object_or_404(Message, id=message_id))
        return Response(message.data, status=HTTP_200_OK)

    def put(self, request: HttpRequest, server_id: int, channel_id: int, message_id: int) -> Response:
        """Updates a Message's information

        Args:
            request (HttpRequest): The request from the frontend with data and proper authorization header.
            server_id (int): The ancestor Server's id.
            channel_id (int): The parent Channel's id.
            message_id (int): The Message's id.

        Returns:
            Response: The rest_framework HTTP response with data and proper status code.
        """

        data = request.data.copy()
        if request.user.id == get_object_or_404(Message, id=message_id).sender:
            message = get_object_or_404(Message, id=message_id)
            ser_message = MessageSerializer(message, data=data, partial=True)
            if ser_message.is_valid():
                return Response(ser_message.data, status=HTTP_200_OK)
            return Response(ser_message.errors, status=HTTP_400_BAD_REQUEST)
        return Response(json.dumps({'Error': 'User is not the author of this message'}), status=HTTP_400_BAD_REQUEST)

    def delete(self, request: HttpRequest, server_id: int, channel_id: int, message_id: int) -> Response:
        """Deletes a Message from a Channel.

        Args:
            request (HttpRequest): The request from the frontend with proper authorization header.
            server_id (int): The ancestor Server's id.
            channel_id (int): The parent Channel's id.
            message_id (int): The Message's id.

        Returns:
            Response: The rest_framework HTTP response with proper status code.
        """
        message = get_object_or_404(Message, id=message_id)
        if request.user.id == message.sender or request.user.id in get_object_or_404(Channel, id=channel_id).moderators or request.user.id == get_object_or_404(Server, id=server_id).admin:
            message.delete()
            return Response(status=HTTP_204_NO_CONTENT)
        return Response(json.dumps({'Error': 'User is not authorized to delete messages'}), status=HTTP_400_BAD_REQUEST)
