from rest_framework.permissions import BasePermission


class PDFPermissions(BasePermission):
    message = "You don't have permission to perform this action"

    def has_permission(self, request, view):
        action = view.action

        return getattr(self, f"can_{action}", None)(request, view)

    def can_generate(self, request, view):
        document_id = request.query_params.get("document_id", None)
        user = request.user
        if user.document_set.filter(pk=document_id).exists():
            return True
        return False

    def can_generate_signed(self, request, view):
        document_id = request.query_params.get("document_id", None)
        user = request.user
        if user.document_set.filter(pk=document_id).exists():
            return True
        return False


class DocumentUserPermissions(BasePermission):
    message = "You don't have permission to perform this action"

    def has_permission(self, request, view):
        action = view.action

        return getattr(self, f"can_{action}", False)(request, view)

    def can_list(self, request, view):
        user_id = int(request.parser_context["kwargs"]["user_pk"])
        return request.user.id == user_id


class DocumentPermissions(BasePermission):
    message = "You don't have permission to perform this action"

    def has_permission(self, request, view):
        action = view.action

        return getattr(self, f"can_{action}", False)(request, view)

    def _is_owner(self, request, object_id):
        user = request.user
        if user.document_set.filter(pk=object_id).exists():
            return True
        return False

    def can_list(self, request, view):
        return True

    def can_retrieve(self, request, view):
        document_id = request.parser_context["kwargs"]["pk"]
        return self._is_owner(request, document_id)

    def can_create(self, request, view):
        return True

    def can_update(self, request, view):
        document_id = request.parser_context["kwargs"]["pk"]
        return self._is_owner(request, document_id)

    def can_partial_update(self, request, view):
        document_id = request.parser_context["kwargs"]["pk"]
        return self._is_owner(request, document_id)

    def can_destroy(self, request, view):
        document_id = request.parser_context["kwargs"]["pk"]
        return self._is_owner(request, document_id)
