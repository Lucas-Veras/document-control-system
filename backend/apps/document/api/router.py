from rest_framework_nested import routers

from apps.account.api.router import user_router
from apps.document.api import views as document_views

router = routers.SimpleRouter()

router.register(r"document", document_views.DocumentViewSet, basename="document")
router.register(r"pdf", document_views.PDFViewSet, basename="pdf")

user_router.register(r"document", document_views.DocumentUserListViewSet, basename="document-user")
