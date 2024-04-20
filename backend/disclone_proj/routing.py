# import our_chat_app.routing
# from channels.routing import ProtocolTypeRouter, URLRouter
# from django.core.asgi import get_asgi_application

# application = ProtocolTypeRouter(
#     {
#         "http": get_asgi_application(),
#         "websocket": URLRouter(our_chat_app.routing.websocket_urlpatterns),
#     }
# )