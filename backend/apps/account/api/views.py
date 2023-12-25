from rest_framework import permissions
from rest_framework.decorators import action
from rest_framework.response import Response

from apps.account.api import serializers as account_serializers
from apps.common.global_drf_viewsets import CustomGenericViewSet


class AccountViewSet(CustomGenericViewSet):
    """
    AccountsViewSet
    """

    permission_classes = [permissions.AllowAny]
    serializer_class = {"register": account_serializers.AccountRegisterSerializer}

    @action(detail=False, methods=["post"])
    def register(self, request, *args, **kwargs):
        """
        Register
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=201)


class UserViewSet(CustomGenericViewSet):
    """
    UsersViewSet
    """

    permission_classes = [permissions.IsAuthenticated]
    serializer_class = {"me": account_serializers.UserSerializer}

    @action(detail=False, methods=["get"])
    def me(self, request, *args, **kwargs):
        """
        Me
        """
        serializer = self.get_serializer(request.user)
        return Response(serializer.data, status=200)
