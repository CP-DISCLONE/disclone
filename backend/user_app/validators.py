from django.core.exceptions import ValidationError
import re


def validate_display_name(display_name: str) -> str:
    """Validates a User's new display name.

    Args:
        display_name (str): The new display name.

    Raises:
        ValidationError: Raised if the display name is not valid.

    Returns:
        str: The valid display name
    """

    error_message = f'''
        {display_name} is not a valid username. Usernames should only contain letters, numbers, or the following special characters: .-_'''
    regex = r'^[A-Za-z\.\-\_]+$'
    good_name = re.match(regex, display_name)
    if good_name:
        return good_name
    raise ValidationError(error_message, params={'display_name': display_name})


def validate_first_name(first_name: str) -> str:
    """Validates a new User's first name.

    Args:
        first_name (str): The new User's first name.

    Raises:
        ValidationError: Raised if the first name is invalid.

    Returns:
        str: The valid first name.
    """

    error_message = f'''
        {first_name} is not a valid name. Names should be in title case and only contain letters'''
    regex = r'^[A-Z][a-z]+$'
    good_name = re.match(regex, first_name)
    if good_name:
        return good_name
    raise ValidationError(error_message, params={"first_name": first_name})


def validate_last_name(last_name: str) -> str:
    """Validates a new User's last name.

    Args:
        last_name (str): The new User's last name.

    Raises:
        ValidationError: Raised if the last name is invalid.

    Returns:
        str: The valid last name.
    """

    error_message = f'''
        {last_name} is not a valid name. Names should be in title case and only contain letters'''
    regex = r'^[A-Z][a-z]+$'
    good_name = re.match(regex, last_name)
    if good_name:
        return good_name
    raise ValidationError(error_message, params={"first_name": last_name})
