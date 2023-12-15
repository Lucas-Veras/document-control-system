from django.db import models

from apps.common.global_models_mixins import TimestampsModelMixin


class Document(TimestampsModelMixin, models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
