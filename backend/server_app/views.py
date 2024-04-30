from django.shortcuts import get_object_or_404, get_list_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.status import (
    HTTP_200_OK,
    HTTP_201_CREATED,
    HTTP_204_NO_CONTENT,
    HTTP_400_BAD_REQUEST
)
import json
from .models import Server, Channel, Message
from user_app.models import User
from .serializers import ServerSerializer, ChannelSerializer, MessageSerializer, GetMessageSerializer
from user_app.views import TokenReq
from datetime import datetime


class All_servers(TokenReq):
    def get(self, request) -> Response:
        servers = get_list_or_404(request.user.servers.all())
        ser_servers = ServerSerializer(servers, many=True)
        return Response(ser_servers.data, status=HTTP_200_OK)

    def post(self, request) -> Response:
        data = request.data.copy()
        data['admin'] = request.user.id
        data['users'] = [request.user.id]
        new_server = ServerSerializer(data=data)
        if new_server.is_valid():
            new_server.save()
            return Response(new_server.data, status=HTTP_201_CREATED)
        return Response(new_server.errors, status=HTTP_400_BAD_REQUEST)


class A_server(TokenReq):
    def add_channels(self, server, lst_of_channel_ids) -> None:
        for channel_id in lst_of_channel_ids:
            if get_object_or_404(Channel, id=channel_id):
                server.channels.add(channel_id)
                server.save()

    def get_server(self, request, server_id) -> Server | None:
        return get_object_or_404(request.user.servers, id=server_id)

    def get(self, request, server_id) -> Response:
        return Response(ServerSerializer(self.get_server(request, server_id)).data, status=HTTP_200_OK)

    def put(self, request, server_id) -> Response:
        data = request.data.copy()
        curr_server = self.get_server(request, server_id)
        if request.user.id == curr_server.admin.id:
            ser_server = ServerSerializer(curr_server, data=data, partial=True)
            if ser_server.is_valid():
                ser_server.save()
                if data.get("admin"):
                    server = get_object_or_404(Server, id=server_id)
                    server.admin = data.get("admin")
                    server.full_clean()
                    server.save()
                if data.get("lst_of_channels"):
                    self.add_channels(server=get_object_or_404(
                        Server, id=server_id), lst_of_channel_ids=data.get("lst_of_channels"))
                return Response(ser_server.data, status=HTTP_200_OK)
            return Response(ser_server.errors, status=HTTP_400_BAD_REQUEST)
        return Response(json.dumps({'Error': 'User is not the server admin'}), status=HTTP_400_BAD_REQUEST)

    def delete(self, request, server_id) -> Response:
        curr_server = self.get_server(request, server_id)
        if request.user.id == curr_server.admin.id:
            curr_server.delete()
            return Response(status=HTTP_204_NO_CONTENT)
        return Response(json.dumps({'Error': 'User is not the current server admin'}), status=HTTP_400_BAD_REQUEST)


class All_channels(TokenReq):
    def get(self, request, server_id) -> Response:
        try:
            channels = ChannelSerializer(
                request.user.servers.get(id=server_id).channels, many=True)
            return Response(channels.data, status=HTTP_200_OK)
        except Exception as e:
            return Response(e, status=HTTP_400_BAD_REQUEST)

    def post(self, request, server_id) -> Response:
        data = request.data.copy()
        curr_server = get_object_or_404(request.user.servers, id=server_id)
        data['server'] = server_id
        if request.user.id == curr_server.admin.id:
            new_channel = ChannelSerializer(data=data)
            if new_channel.is_valid():
                new_channel.save()
                return Response(new_channel.data, status=HTTP_201_CREATED)
            return Response(new_channel.errors, status=HTTP_400_BAD_REQUEST)
        return Response(json.dumps({'Error': 'User is not the server admin'}), status=HTTP_400_BAD_REQUEST)


class A_channel(TokenReq):
    def add_messages(self, channel, lst_of_message_ids) -> None:
        for message_id in lst_of_message_ids:
            if get_object_or_404(Message, id=message_id):
                channel.messages.add(message_id)
                channel.save()

    def get(self, request, server_id, channel_id) -> Response:
        channel = ChannelSerializer(get_object_or_404(Channel, id=channel_id))
        return Response(channel.data, status=HTTP_200_OK)

    def put(self, request, server_id, channel_id) -> Response:
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

    def delete(self, request, server_id, channel_id) -> Response:
        server = get_object_or_404(Server, id=server_id)
        channel = get_object_or_404(Channel, id=channel_id)
        if request.user.id == server['admin']:
            channel.delete()
            return Response(status=HTTP_204_NO_CONTENT)
        return Response(json.dumps({'Error': 'User is not the server admin'}), status=HTTP_400_BAD_REQUEST)


class All_messages(TokenReq):
    def get(self, request, server_id, channel_id) -> Response:
        channel = get_object_or_404(Channel, id=channel_id)
        messages = GetMessageSerializer(channel.messages, many=True)
        return Response(messages.data, status=HTTP_200_OK)

    def post(self, request, server_id, channel_id) -> Response:
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
    def get(self, request, server_id, channel_id, message_id) -> Response:
        message = MessageSerializer(get_object_or_404(Message, id=message_id))
        return Response(message.data, status=HTTP_200_OK)

    def put(self, request, server_id, channel_id, message_id) -> Response:
        data = request.data.copy()
        if request.user.id == get_object_or_404(Message, id=message_id).sender:
            message = get_object_or_404(Message, id=message_id)
            ser_message = MessageSerializer(message, data=data, partial=True)
            if ser_message.is_valid():
                return Response(ser_message.data, status=HTTP_200_OK)
            return Response(ser_message.errors, status=HTTP_400_BAD_REQUEST)
        return Response(json.dumps({'Error': 'User is not the author of this message'}), status=HTTP_400_BAD_REQUEST)

    def delete(self, request, server_id, channel_id, message_id) -> Response:
        message = get_object_or_404(Message, id=message_id)
        if request.user.id == message.sender or request.user.id in get_object_or_404(Channel, id=channel_id).moderators or request.user.id == get_object_or_404(Server, id=server_id).admin:
            message.delete()
            return Response(status=HTTP_204_NO_CONTENT)
        return Response(json.dumps({'Error': 'User is not authorized to delete messages'}), status=HTTP_400_BAD_REQUEST)
