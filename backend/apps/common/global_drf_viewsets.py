"""
Global DRF Viewsets
"""

from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, viewsets

from apps.common.global_drf_render import CustomRenderer
from apps.common.global_drf_viewsets_mixins import (
    PermissionsMixin,
    SerializerAndPrefetchMixin,
)


class CustomModelViewSet(PermissionsMixin, SerializerAndPrefetchMixin, viewsets.ModelViewSet):
    """
    A viewset that provides default `create()`, `retrieve()`, `update()`, `partial_update()`, `destroy()` and `list()` actions.
    """

    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    renderer_classes = [CustomRenderer]


class CustomReadOnlyModelViewSet(PermissionsMixin, SerializerAndPrefetchMixin, viewsets.ReadOnlyModelViewSet):
    """
    A viewset that provides default `list()` and `retrieve()` actions.
    """

    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    renderer_classes = [CustomRenderer]


class CustomGenericViewSet(PermissionsMixin, SerializerAndPrefetchMixin, viewsets.GenericViewSet):
    """
    A viewset that provides the default actions provided by the `ListModelMixin` and `RetrieveModelMixin` mixins.
    """

    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    renderer_classes = [CustomRenderer]
