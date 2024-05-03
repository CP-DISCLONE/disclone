from django.contrib import admin
from .models import User

# Registers the User model to the Django Admin site
admin.site.register([User])