from rest_framework import serializers
from rest_framework.validators import UniqueValidator

from apps.common.global_exceptions import SerializerMethodDontAllowedException
from apps.document.models import Document


class DocumentSerializer(serializers.ModelSerializer):
    """
    DocumentSerializer
    """

    class Meta:
        model = Document
        fields = ("id", "name", "description")
