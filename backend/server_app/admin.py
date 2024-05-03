from django.contrib import admin
from .models import Server, Channel, Message

# Registers the Server, Channel, and Message model to the Django Admin site
admin.site.register([Server, Channel, Message])
