from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core import validators as v
from .validators import validate_display_name, validate_first_name, validate_last_name
import os
import uuid


def generate_filename(instance, filename):
    """Generate a unique filename for the uploaded image."""
    ext = filename.split('.')[-1]
    # Generate a UUID4 filename
    filename = f"{uuid.uuid4()}.{ext}"
    # Join the filename with the 'media/' directory
    return os.path.join('', filename)


class User(AbstractUser):
    """The class that holds the application User model.

    Args:
        AbstractUser (class): Django AbstractUser class
    """
    email = models.EmailField(
        unique=True, verbose_name='Email Address', max_length=255)
    display_name = models.CharField(max_length=25, validators=[
                                    validate_display_name, v.MinLengthValidator(6), v.MaxLengthValidator(25)])
    first_name = models.CharField(
        max_length=50, validators=[validate_first_name])
    last_name = models.CharField(
        max_length=50, validators=[validate_last_name])
    profile_picture = models.ImageField(
        null=True, blank=True, upload_to=generate_filename)
    is_admin = models.BooleanField(default=False)
    is_moderator = models.BooleanField(default=False)
    # servers: set by users field of Server
    # owned_servers: set by admin field of Server if user is owner
    # owned_channels: set by moderators field of Channel if user is a moderator of a channel
    # messages: set by sender field of Message model

    # Sets the username to the User's email by default
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = [display_name, first_name, last_name]
