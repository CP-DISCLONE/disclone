from django.db import models
from user_app.models import User
from django.core import validators as v


class Server(models.Model):
    users = models.ManyToManyField(User, related_name="servers")
    admin = models.ForeignKey(User, on_delete=models.SET_NULL, related_name="owned_server", null=True)
    name = models.CharField(max_length=50, validators=[
                            v.MinLengthValidator(5)])
    # channels[] from associated foreign key relationship from channels model
    

class Channel(models.Model):
    server = models.ForeignKey(Server, on_delete=models.CASCADE, related_name='channels')
    moderators = models.ManyToManyField(Server, related_name='owned_channels')
    name = models.CharField(max_length=50, validators=[v.MinLengthValidator(6)])
    # messages[] from associated foreign key relationship from messages model


class Message(models.Model):
    channel = models.ForeignKey(Channel, on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='messages')
    text = models.TextField()
