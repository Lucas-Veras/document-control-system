from rest_framework import exceptions


class BusinessException(exceptions.APIException):
    status_code = 400
    default_detail = "Business exception."
    default_code = "business_exception"
    location = "body"

    def __init__(self, detail=None, code=None, message=None, status_code=None, location=None):
        if detail is not None:
            self.detail = detail
        if code is not None:
            self.code = code
        if message is not None:
            self.message = message
        if status_code is not None:
            self.status_code = status_code
        if location is not None:
            self.location = location
        self.detail = self.message


class SerializerMethodDontAllowedException(BusinessException):
    default_detail = "Serializer method not exists."
    default_code = "serializer_method_not_exists_exception"
