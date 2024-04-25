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
from .serializers import ServerSerializer
from user_app.views import TokenReq


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
        if data.get("lst_of_channels"):
            self.add_channels(server=get_object_or_404(
                Server, id=server_id), lst_of_channel_ids=data.get("lst_of_channels"))
        if data.get("admin"):
            server = get_object_or_404(Server, id=server_id)
            server.admin = data.get("admin")
            server.full_clean()
            server.save()
        curr_server = self.get_server(request, server_id)
        ser_server = ServerSerializer(curr_server, data=data, partial=True)
        if ser_server.is_valid():
            ser_server.save()
            return Response(ser_server.data, status=HTTP_200_OK)
        return Response(ser_server.errors, status=HTTP_400_BAD_REQUEST)

    def delete(self, request, server_id) -> Response:
        curr_server = self.get_server(request, server_id)
        curr_server.delete()
        return Response(status=HTTP_204_NO_CONTENT)



