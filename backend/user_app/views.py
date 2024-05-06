from rest_framework.views import APIView
from rest_framework.authentication import TokenAuthentication
from rest_framework.response import Response
from django.http import HttpRequest
from rest_framework.authtoken.models import Token
from rest_framework.status import (
    HTTP_200_OK,
    HTTP_201_CREATED,
    HTTP_204_NO_CONTENT,
    HTTP_400_BAD_REQUEST,
    HTTP_404_NOT_FOUND
)
from rest_framework.permissions import IsAuthenticated
from django.core.exceptions import ValidationError
from django.contrib.auth import authenticate, login, logout
from .models import User
import base64
from django.core.files.base import ContentFile


class TokenReq(APIView):
    """A class that defines the required authentication and permission classes for access to a class's methods.

    This class ensures that any class that inherits it not only inherits all functionality from the
    APIView class, but also the permissions and authentication required to access the methods within
    the class.

    Args:
        APIView (class): The rest_framework APIView class.
    """
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]


class Info (TokenReq):
    """The view that holds the methods to grab or update a User's information.

    Args:
        TokenReq (class): Permissions and base class to create the view.
    """

    def get(self, request: HttpRequest) -> Response:
        """Gets a User's relevant information and returns it to the frontend.

        Args:
            request (HttpRequest): The request from the frontend with proper authorization header.

        Returns:
            Response: The rest_framework HTTP response with data and proper status code.
        """
        profile_picture_url = request.user.profile_picture.url if request.user.profile_picture else None
        data = {"email": request.user.email, "display_name": request.user.display_name,
                "first_name": request.user.first_name, "last_name": request.user.last_name, "profile_picture": profile_picture_url}
        return Response(data, status=HTTP_200_OK)

    def put(self, request: HttpRequest) -> Response:
        """Updates a User's display name or profile picture and returns the User's information to the frontend.

        Args:
            request (HttpRequest): The request from the frontend with new data and proper authorization header.

        Returns:
            Response: The rest_framework HTTP response with data and proper status code.
        """

        data = request.data.copy()
        user = User.objects.get(username=request.user.email)

        # Update display name if provided and not empty
        if "display_name" in data and data["display_name"]:
            user.display_name = data["display_name"]

        # Update profile picture if provided
        if "profile_picture" in data:
            profile_picture = data["profile_picture"]
            # Decode base64 string to binary image data
            binary_data = base64.b64decode(profile_picture)
            # Create a ContentFile object from the binary data
            profile_picture = ContentFile(
                binary_data, name="profile_picture.jpg")
            user.profile_picture.save("profile_picture.jpg", profile_picture)

        try:
            user.full_clean()
            user.save()
            user_data = {
                "email": request.user.email,
                "display_name": request.user.display_name,
                "first_name": request.user.first_name,
                "last_name": request.user.last_name,
                "profile_picture": user.profile_picture
            }
            return Response(user_data, status=HTTP_200_OK)
        except ValidationError as e:
            return Response(e.message_dict, status=HTTP_400_BAD_REQUEST)


class Sign_up(APIView):
    """The view that holds the method for a new User to sign up.

    Args:
        APIView (class): The rest_framwork APIView class
    """

    def post(self, request: HttpRequest) -> Response:
        """Creates a new User, logs them in, and returns their token and information to the frontend.

        Args:
            request (HttpRequest): The request from the frontend with new data.

        Returns:
            Response: The rest_framework HTTP response with data and proper status code.
        """

        data = request.data.copy()
        data['username'] = data.get("email")
        new_user = User(**data)
        try:
            new_user.full_clean()
            new_user = User.objects.create_user(**data)
            token = Token.objects.create(user=new_user)
            login(request, new_user)
            _response = Response(
                {
                    "display_name": new_user.display_name,
                    "email": new_user.email,
                    "first_name": new_user.first_name,
                    "last_name": new_user.last_name,
                    "token": token.key
                },
                status=HTTP_201_CREATED)
            return _response
        except ValidationError as e:
            print(e)
            return Response(e.message_dict, status=HTTP_400_BAD_REQUEST)


class Log_in(APIView):
    """The view that holds the method for an existing User to log in.

    Args:
        APIView (class): The rest_framwork APIView class.
    """

    def post(self, request: HttpRequest) -> Response:
        """Logs an existing User into their account.

        Args:
            request (HttpRequest): The request from the frontend with the data.

        Returns:
            Response: The rest_framework Response with data and proper status code.
        """

        data = request.data.copy()
        user = authenticate(username=data.get("email"),
                            password=data.get("password"))
        if user:
            token, created = Token.objects.get_or_create(user=user)
            login(request, user)
            _response = Response(
                {
                    "display_name": user.display_name,
                    "email": user.email,
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                    "token": token.key
                },
                status=HTTP_200_OK)
            return _response
        return Response("No user matching these credentials", status=HTTP_404_NOT_FOUND)


class Log_out(APIView):
    """The view that holds the method for a User to log out.

    Args:
        APIView (class): The rest_framework APIView class.
    """

    def post(self, request: HttpRequest) -> Response:
        """Logs a User out and flushes their current session and token.

        Args:
            request (HttpRequest): The request from the frontend with proper authorization header.

        Returns:
            Response: The rest_framework Response with the proper status code.
        """

        request.user.auth_token.delete()
        logout(request)
        _response = Response(status=HTTP_204_NO_CONTENT)
        return _response
