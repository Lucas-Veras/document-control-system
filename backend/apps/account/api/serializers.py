from rest_framework import serializers
from rest_framework.validators import UniqueValidator

from apps.account.business import AccountBusiness
from apps.account.models import User
from apps.common.global_exceptions import SerializerMethodDontAllowedException


class AccountRegisterSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150, validators=[UniqueValidator(queryset=User.objects.all())])
    first_name = serializers.CharField(max_length=150)
    last_name = serializers.CharField(max_length=150)
    email = serializers.EmailField(max_length=150, validators=[UniqueValidator(queryset=User.objects.all())])
    password = serializers.CharField(max_length=128, write_only=True)

    def create(self, validated_data):
        return AccountBusiness(None, validated_data).create()

    def update(self, instance, validated_data):
        raise SerializerMethodDontAllowedException()
