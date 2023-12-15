from django.core.exceptions import PermissionDenied
from django.http import Http404
from rest_framework import exceptions
from rest_framework.response import Response
from rest_framework.views import exception_handler

from apps.common.global_exceptions import BusinessException


def custom_exception_handler(exc, context):
    """
    Returns the response that should be used for any given exception.

    By default we handle the REST framework `APIException`, and also
    Django's built-in `Http404` and `PermissionDenied` exceptions.

    Any unhandled exceptions may return `None`, which will cause a 500 error
    to be raised.
    """
    base_response = exception_handler(exc, context)
    if base_response is None:
        return None

    custom_response = {"data": {}, "metadata": {}, "success": False, "errors": []}

    if isinstance(exc, Http404) or isinstance(exc, exceptions.NotFound):
        exc = exceptions.NotFound()
    elif isinstance(exc, PermissionDenied) or isinstance(exc, exceptions.PermissionDenied):
        exc = exceptions.PermissionDenied()

    if isinstance(exc, exceptions.APIException):
        if isinstance(exc, exceptions.NotAuthenticated):
            custom_response["errors"].append({"type": "system", "message": exc.detail, "location": ""})
        elif isinstance(exc, exceptions.PermissionDenied):
            custom_response["errors"].append({"type": "system", "message": exc.detail, "location": "url"})
        elif isinstance(exc, exceptions.NotFound):
            custom_response["errors"].append({"type": "system", "message": exc.detail, "location": "url"})
        elif isinstance(exc, exceptions.ValidationError):
            custom_response["errors"].extend(flat_error(exc.detail))
        elif isinstance(exc, BusinessException):
            custom_response["errors"].append({"type": "business", "message": exc.detail, "location": exc.location})
        else:
            custom_response["errors"].append({"type": "system", "message": exc.detail, "location": ""})

    return Response(custom_response, status=base_response.status_code, headers=base_response.headers)


def flat_error(errors, prefix=""):
    flat_errors = []
    for key, value in errors.items():
        if isinstance(value, list):
            for index, item in enumerate(value):
                if isinstance(item, dict):
                    flat_errors.extend(flat_error(item, f"{prefix}{key}.{index}."))
                else:
                    location = f"{prefix}{key}.{index}"
                    if location.endswith(".0"):
                        location = location[:-2]
                    flat_errors.append({"type": "validation", "message": item, "location": location})
        else:
            location = f"{prefix}{key}"
            if location.endswith(".0"):
                location = location[:-2]
            flat_errors.append({"type": "validation", "message": value, "location": location})
    return flat_errors
