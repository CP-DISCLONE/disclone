import json
from channels.generic.websocket import AsyncWebsocketConsumer


class TextRoomConsumer(AsyncWebsocketConsumer):
    """The Text Chat Consumer that handles connections and messages within a channel layer.

    Args:
        AsyncWebsocketConsumer (class): The channels AsyncWebsocketConsumer class.
    """

    async def connect(self) -> None:
        """Asynchronous method that handles a new chat room being opened.

        When the socket is connected, the room name and group are connected to the channel layer and begins to accept new messages.
        """

        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = f"chat_{self.room_name}"
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code) -> None:
        """Asynchronous method that handles a chat room being closed.

        When the socket is disconnected, the room name and group are discarded from the channel layer.
        """

        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data: json) -> None:
        """Asynchronous method that receives a message from the channel layer and sends it to the group connected to the channel.

        This method responds to text_data that is sent into the channel layer by the chat_message method and is necessary to 
        ensure that all data is relayed to all clients connected to the channel.

        Args:
            text_data (json): The message data.
        """

        text_data_json = json.loads(text_data)
        text = text_data_json['text']
        sender = text_data_json['sender']
        datetime = text_data_json['datetime']
        await self.channel_layer.group_send(self.room_group_name,
                                            {
                                                'type': 'chat.message',
                                                'message': text,
                                                'sender': sender,
                                                'datetime': datetime
                                            }
                                            )

    async def chat_message(self, event: dict) -> None:
        """Asynchronous method that receives text data from the client and sends it into the channel layer.

        This method is necessary to receive any event that occurs in the WebSocket connection and relay it to the channel
        for the channel to effectively send it to the entire group.

        Args:
            event (dict): Event data received from the channel.
        """

        text = event['message']
        sender = event['sender']
        datetime = event['datetime']
        await self.send(text_data=json.dumps({
            'text': text,
            'sender': sender,
            'datetime': datetime
        }))
