from rest_framework import serializers
from rest_framework.validators import UniqueValidator

from apps.common.global_exceptions import SerializerMethodDontAllowedException
from apps.document.models import Document


class DocumentSerializer(serializers.ModelSerializer):
    """
    DocumentSerializer
    """

    user = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = Document
        fields = ("id", "name", "description", "user")


class DocumentInputSerializer(serializers.Serializer):
    """
    DocumentInputSerializer
    """

    file = serializers.FileField()
