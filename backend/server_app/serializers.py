from rest_framework.serializers import ModelSerializer
from .models import Server, Channel, Message


class MessageSerializer(ModelSerializer):

    class Meta:
        model = Message
        fields = "__all__"


class ChannelSerializer(ModelSerializer):
    messages = MessageSerializer(many=True, read_only=True)

    class Meta:
        model = Channel
        fields = "__all__"


class ServerSerializer(ModelSerializer):
    channels = ChannelSerializer(many=True, read_only=True)

    class Meta:
        model = Server
        fields = "__all__"
