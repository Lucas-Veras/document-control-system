from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from apps.document.api.router import router, user_router

urlpatterns = [
    *router.urls,
    *user_router.urls,
]
