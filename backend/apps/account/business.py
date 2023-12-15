from django.db import transaction

from apps.account.models import User


class AccountBusiness:
    def __init__(self, account, serializer_data):
        self.account = account
        self.serializer_data = serializer_data

    @transaction.atomic
    def create(self):
        user = User.objects.create_user(**self.serializer_data)
        return user
