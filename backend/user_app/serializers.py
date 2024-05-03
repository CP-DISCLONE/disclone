from rest_framework.serializers import ModelSerializer
from .models import User


class UserSerializer(ModelSerializer):
    """The Serializer that returns Users' display names.

    Args:
        ModelSerializer (class): The rest_framework ModelSerializer class.
    """

    class Meta:
        # Meta class that provides the model and fields to be serialized.
        model = User
        fields = ['email', 'display_name', 'first_name',
                  'last_name', 'profile_picture']
