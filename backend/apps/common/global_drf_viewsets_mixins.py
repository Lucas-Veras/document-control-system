"""
Global DRF Viewsets Mixins
"""


class SerializerAndPrefetchMixin:
    """
    A mixin that permits to define a serializer class for each action and a list of fields to prefetch.
    """

    qs_select_fields = None
    qs_prefetch_fields = None
    qs_list_select_fields = None
    qs_list_prefetch_fields = None

    def get_serializer_class(self):
        serializer_class = self.serializer_class
        if isinstance(serializer_class, dict):
            if self.action in serializer_class:
                return serializer_class[self.action]
            return serializer_class["default"]
        return serializer_class

    def get_queryset(self):
        qs = super().get_queryset()

        if self.action == "list":
            if self.qs_list_select_fields:
                qs = qs.select_related(*self.qs_list_select_fields)
            if self.qs_list_prefetch_fields:
                qs = qs.prefetch_related(*self.qs_list_prefetch_fields)
            return qs

        if self.qs_select_fields:
            qs = qs.select_related(*self.qs_select_fields)
        if self.qs_prefetch_fields:
            qs = qs.prefetch_related(*self.qs_prefetch_fields)

        return qs


class PermissionsMixin:
    """
    A mixin that permits to define a permission class for each action.
    """

    permission_classes = None

    def get_permissions(self):
        permission_classes = self.permission_classes
        if isinstance(permission_classes, dict):
            if self.action in permission_classes:
                return [permission() for permission in permission_classes[self.action]]
            return [permission() for permission in permission_classes["default"]]
        return [permission() for permission in permission_classes]
