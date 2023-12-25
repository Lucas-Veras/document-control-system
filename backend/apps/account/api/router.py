from rest_framework_nested import routers

from apps.account.api import views as account_views

router = routers.SimpleRouter()

router.register(r"account", account_views.AccountViewSet, basename="accounts")
router.register(r"user", account_views.UserViewSet, basename="users")

user_router = routers.NestedSimpleRouter(router, r"user", lookup="user")
