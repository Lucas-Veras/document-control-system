from django.db import models


class TimestampsModelMixin(models.Model):
    """
    TimestampsModelMixin

    A model mixin that automatically adds the following fields to a model:
        - created_at
        - updated_at
    """

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True
