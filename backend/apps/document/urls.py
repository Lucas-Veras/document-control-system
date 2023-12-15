from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from apps.document.api.router import router

urlpatterns = [
    *router.urls,
]
