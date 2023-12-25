from django.db import models

from apps.account.models import User
from apps.common.global_models_mixins import TimestampsModelMixin


class Document(TimestampsModelMixin, models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    class Meta:
        verbose_name = "Document"
        verbose_name_plural = "Documents"

    def __str__(self):
        return self.name


class PDFSignedDocument(TimestampsModelMixin, models.Model):
    file = models.FileField(upload_to="storage")
    hash = models.CharField(max_length=255)

    class Meta:
        verbose_name = "PDF Signed Document"
        verbose_name_plural = "PDF Signed Documents"

    def __str__(self):
        return self.hash
