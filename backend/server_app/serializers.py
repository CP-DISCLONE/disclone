from rest_framework.serializers import ModelSerializer, SerializerMethodField, DateTimeField
from .models import Server, Channel, Message
from user_app.serializers import UserSerializer
from user_app.models import User


class GetMessageSerializer(ModelSerializer):
    sender = SerializerMethodField()
    datetime = DateTimeField(format="%H:%M - %B %d, %Y ")

    class Meta:
        model = Message
        fields = "__all__"

    def get_sender(self, obj):
        def get_user(user_id):
            user = User.objects.get(id=user_id)
            return user.display_name
        return get_user(obj.sender.id) if obj.sender else None


class MessageSerializer(ModelSerializer):
    class Meta:
        model = Message
        fields = "__all__"


class ChannelSerializer(ModelSerializer):
    messages = MessageSerializer(many=True, read_only=True)

    class Meta:
        model = Channel
        fields = "__all__"


class ChannelOnlySerializer(ModelSerializer):
    class Meta:
        model = Channel
        fields = "__all__"


class ServerSerializer(ModelSerializer):
    channels = ChannelSerializer(many=True, read_only=True)

    class Meta:
        model = Server
        fields = "__all__"


class ServerOnlySerializer(ModelSerializer):
    class Meta:
        model = Server
        fields = "__all__"
