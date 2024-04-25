from django.urls import path
from .views import All_servers, A_server

urlpatterns = [
    path('', All_servers.as_view(), name='all_servers'),
    path('<int:server_id>/', A_server.as_view(), name='a_server')
]
