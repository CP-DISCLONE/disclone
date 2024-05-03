from django.db import models
from user_app.models import User
from django.core import validators as v


class Server(models.Model):
    """The class that holds the application Server model.

    Args:
        models.Model (class): The django.db Model class.
    """
    
    users = models.ManyToManyField(User, related_name="servers")
    admin = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="owned_server")
    name = models.CharField(max_length=50, validators=[
                            v.MinLengthValidator(5)])
    # channels[] from associated foreign key relationship from channels model


class Channel(models.Model):
    """The class that holds the application Channel model.

    Args:
        models.Model (class): The django.db Model class.
    """
    server = models.ForeignKey(
        Server, on_delete=models.CASCADE, related_name='channels')
    moderators = models.ManyToManyField(Server, related_name='owned_channels')
    name = models.CharField(max_length=50, validators=[
                            v.MinLengthValidator(6)])
    # messages[] from associated foreign key relationship from messages model


class Message(models.Model):
    """The class that holds the application Message model.

    Args:
        models.Model (class): The django.db Model class.
    """
    channel = models.ForeignKey(
        Channel, on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='messages')
    text = models.TextField(validators=[v.MinLengthValidator(1)])
    datetime = models.DateTimeField(null=True, blank=True)
