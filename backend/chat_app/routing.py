from channels.routing import ProtocolTypeRouter, URLRouter
from django.urls import re_path
from chat_app.consumers import TextRoomConsumer

websocket_urlpatterns = [
    re_path(r'^ws/(?P<room_name>[^/]+)/$', TextRoomConsumer.as_asgi()),
]
