from django.urls import re_path
from chat_app.consumers import TextRoomConsumer

websocket_urlpatterns = [
    # The route that maps the websocket channel to the TextRoomConsumer
    re_path(r'^ws/chat/(?P<room_name>[^/]+)/$', TextRoomConsumer.as_asgi()),
]
