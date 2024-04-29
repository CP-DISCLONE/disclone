from django.urls import re_path
from chat_app.consumers import TextRoomConsumer, VideoRoomConsumer

websocket_urlpatterns = [
    re_path(r'^ws/chat/(?P<room_name>[^/]+)/$', TextRoomConsumer.as_asgi()),
    # re_path(r'^ws/video/(?P<room_name>[^/]+)/$', VideoRoomConsumer.as_asgi()),
    re_path(r'', VideoRoomConsumer.as_asgi()),
]
