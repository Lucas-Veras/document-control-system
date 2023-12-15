from rest_framework import routers

from apps.document.api import views as document_views

router = routers.SimpleRouter()

router.register(r"document", document_views.DocumentViewSet, basename="document")
