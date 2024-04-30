import json
from channels.generic.websocket import AsyncWebsocketConsumer


class TextRoomConsumer(AsyncWebsocketConsumer):
    async def connect(self) -> None:
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = f"chat_{self.room_name}"
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code) -> None:
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data) -> None:
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

    async def chat_message(self, event) -> None:
        text = event['message']
        sender = event['sender']
        datetime = event['datetime']
        await self.send(text_data=json.dumps({
            'text': text,
            'sender': sender,
            'datetime': datetime
        }))
