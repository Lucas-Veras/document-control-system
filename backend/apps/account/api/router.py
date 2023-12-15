from rest_framework import routers

from apps.account.api import views as account_views

router = routers.SimpleRouter()

router.register(r"account", account_views.AccountViewSet, basename="accounts")
