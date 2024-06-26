from django.urls import path
from .views import (
    All_servers,
    A_server,
    All_channels,
    A_channel,
    All_messages,
    A_message
)

urlpatterns = [
     # The routes that map the API endpoints to all server_app views
    path('', All_servers.as_view(), name='all_servers'),
    path('<int:server_id>/', A_server.as_view(), name='a_server'),
    path('<int:server_id>/method/<str:method>/',
         A_server.as_view(), name='add_or_remove_from_server'),
    path('<int:server_id>/channels/', All_channels.as_view(), name='all_channels'),
    path('<int:server_id>/channels/<int:channel_id>/',
         A_channel.as_view(), name='a_channel'),
    path('<int:server_id>/channels/<int:channel_id>/messages/',
         All_messages.as_view(), name='all_messages'),
    path('<int:server_id>/channels/<int:channel_id>/messages/<int:message_id>/',
         A_message.as_view(), name='a_message')
]
