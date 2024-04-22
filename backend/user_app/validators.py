from django.core.exceptions import ValidationError
import re


def validate_display_name(display_name: str) -> str:
    error_message = f'''
        {display_name} is not a valid username. Usernames should only contain letters, numbers, or the following special characters: .-_'''
    regex = r'^[A-Za-z\.\-\_]+$'
    good_name = re.match(regex, display_name)
    if good_name:
        return good_name
    raise ValidationError(error_message, params={'display_name': display_name})


def validate_first_name(first_name: str) -> str:
    error_message = f'''
        {first_name} is not a valid name. Names should be in title case and only contain letters'''
    regex = r'^[A-Z][a-z]+$'
    good_name = re.match(regex, first_name)
    if good_name:
        return good_name
    raise ValidationError(error_message, params={"first_name": first_name})


def validate_last_name(last_name: str) -> str:
    error_message = f'''
        {last_name} is not a valid name. Names should be in title case and only contain letters'''
    regex = r'^[A-Z][a-z]+$'
    good_name = re.match(regex, last_name)
    if good_name:
        return good_name
    raise ValidationError(error_message, params={"first_name": last_name})
