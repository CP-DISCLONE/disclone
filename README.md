Last Development:

- Added celery.py to disclone_proj dir and configured disclone_proj.settings and disclone_proj.init to handle Redis server in back end and celery hook-up to Redis.

  - In order to signify that a background task needs to occur to Celery, we use the @shared_task decorator above the method so that Celery picks it up from throughout the project upon running it and starts serving any requests/dependency tasks that hit it.
  - Ex:

    ```
    from celery import shared_task

    @shared_task
    def add(x, y):
        return x + y
    ```

  - Celery ended up being needed because we need a way to serve the Django channel/websocket results to the client without axios queries being made from the front-end (responses being sent without requests).
    - Redis is needed as a Celery dependency because Celery is a worker, and Redis will be the host for that worker.

- In order to use a WebSocket we need to have a web server that supports it, which Gunicorn is not configured to handle. Instead, the option that I see pointed to most is Daphne, which is an HTTP, HTTP2 and WebSocket protocol server for ASGI and ASGI-HTTP develop to power Django Channels.

  - We must configure our application to use the disclone_proj.asgi to use ASGI-HTTP serving, which I took care of, when we have our first websocket build we will run all services with:
    - `daphne disclone_proj.asgi:application --bind 0.0.0.0:8000`
  - The django-channels and daphne dependencies have been frozen into requirements.txt, the docker-compose.yml rebuild will handle installation.
  - ONCE WE HAVE CREATED OUR FIRST WEBSOCKET AND CONFIGURED ROUTING TO IT, WE WILL RUN ON THIS DAPHNE SERVICE AND HOT RELOADING WILL STILL WORK. UNTIL THEN WE STILL HAVE TO RUN ON DJANGO DEFAULT. DOCKER-COMPOSE.YML WILL BE CHANGED AS WELL.

- Django channels are a communication system which allows multiple consumer instances to talk with each other, and with other parts of Django.

  - A channel layer provides these abstractions:
    - A channel is a mailbox that messages can be sent to. Each channel has a name. Anyone who has the name of the channel can send a message to the channel.
    - A group is a group of related channels. A group has a name. Anyone who has the name of a group can add/remove a channel in the group by name and send a message to all channels in the group.
      - USEFUL FOR PERMISSIONS WE TALKED ABOUT.
    - Every consumer instances has an automatically generated unique channel name that can be communicated via channel layer

- The CHANNEL_LAYERS and CACHING configurations, as well as the CELERY_BROKER_URL and CELERY_RESULT_BACKEND configurations have been made in the settings.py which you can check out.

- We will then need to define how we will interact with our React application, which we will receive every message (JSON string) from and do something with.

  - Here is an example from the tutorial I read through:

    - ```
      # chat/consumers.py
      import json

      from channels.generic.websocket import WebsocketConsumer
      from . import tasks

      class ChatConsumer(WebsocketConsumer):
          def receive(self, text_data):
              # Here we receive some data from the client
              text_data_json = json.loads(text_data)
              message = text_data_json['message']

              # Here we can process client data and send result back directly
              # to the client (by using his unique channel name - `self.channel_name`)
              task.process_client_data_in_the_background_and_send_message_back_to_the_client(self.channel_name, message)

              # And send some result back to that client immediately
              self.send(text_data=json.dumps({'message': 'Your request was received!'}))
      ```

  - Our application can have multiple consumers as well, so we need to have URL routing similar to urls.py but instead it will be called routing.py and handle channel routing:

    - ```
      # chat/routing.py
      from django.conf.urls import url

      from . import consumers

      websocket_urlpatterns = [
          url(r'^ws/chat/$', consumers.ChatConsumer),
      ]
      ```

  - Ultimately, when the frontend sends a message to the WebSocket path /ws/chat/ it will be processed by the ChatConsumer

  - A final disclone_proj.routing will have to be made to handle project routing:

    - ```
      # project/routing.py
      from channels.routing import ProtocolTypeRouter, URLRouter
      import chat.routing
      application = ProtocolTypeRouter({
          # (http->Django views is added by default)
          'websocket':
              URLRouter(
                  chat.routing.websocket_urlpatterns
              ),
      })
      ```

  - The ASGI_APPLICATION setting is configured in our settings.py as well.

- The Dockerfiles and docker-compose.yml are updated to reflect this change as well.

- Next step is to get a chat websocket app configured and running a stream.
