from rest_framework.serializers import ModelSerializer, SerializerMethodField, DateTimeField
from .models import Server, Channel, Message
from user_app.models import User


class GetMessageSerializer(ModelSerializer):
    """The Serializer that returns all relevant Message elements with sender display name.

    Args:
        ModelSerializer (class): The rest_framwork ModelSerializer class.
    """

    sender = SerializerMethodField()
    datetime = DateTimeField(format="%H:%M - %B %d, %Y ")

    class Meta:
        # Meta class that provides the model and fields to be serialized.
        model = Message
        fields = "__all__"

    def get_sender(self, user: User) -> str:
        """The method that grabs the User's display name for the sender field of the serialized
        data.

        Args:
            user (User): The User that sent the message.
        """

        def get_user(user_id: int) -> str:
            user = User.objects.get(id=user_id)
            return user.display_name
        return get_user(user.sender.id) if user.sender else None


class MessageSerializer(ModelSerializer):
    """The Serializer that returns Message Model data.

    Args:
        ModelSerializer (class): The rest_framework ModelSerializer class.
    """

    class Meta:
        # Meta class that provides the model and fields to be serialized
        model = Message
        fields = "__all__"


class ChannelSerializer(ModelSerializer):
    """The Serializer that returns all Channel Model data with relationships.

    Args:
        ModelSerializer (class): The rest_framework ModelSerializer class.
    """

    messages = MessageSerializer(many=True, read_only=True)

    class Meta:
        # Meta class that provides the model and fields to be serialized
        model = Channel
        fields = "__all__"


class ChannelOnlySerializer(ModelSerializer):
    """The Serializer that returns all Channel Model data without relationships.

    Args:
        ModelSerializer (class): The rest_framework ModelSerializer class.
    """

    class Meta:
        # Meta class that provides the model and fields to be serialized
        model = Channel
        fields = "__all__"


class ServerSerializer(ModelSerializer):
    """The Serializer that returns all Server Model data with relationships.

    Args:
        ModelSerializer (class): The rest_framework ModelSerializer class.
    """

    channels = ChannelSerializer(many=True, read_only=True)

    class Meta:
        # Meta class that provides the model and fields to be serialized.
        model = Server
        fields = "__all__"


class ServerOnlySerializer(ModelSerializer):
    """The Serializer that returns all Server Model data without relationships.

    Args:
        ModelSerializer (class): The rest_framework ModelSerializer class.
    """

    class Meta:
        # Meta class that provides the model and fields to be serialized
        model = Server
        fields = "__all__"
