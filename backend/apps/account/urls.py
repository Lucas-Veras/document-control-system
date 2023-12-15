from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from apps.account.api.router import router

urlpatterns = [
    path("account/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("account/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    *router.urls,
]
