from django.http import HttpResponse
from rest_framework import permissions
from rest_framework.decorators import action
from rest_framework.response import Response

from apps.common.global_drf_viewsets import CustomGenericViewSet, CustomModelViewSet
from apps.document import models as document_models
from apps.document.api import serializers as document_serializers
from apps.document.business import DocumentBusiness


class DocumentViewSet(CustomModelViewSet):
    """
    DocumentsViewSet
    """

    queryset = document_models.Document.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = document_serializers.DocumentSerializer

    @action(detail=True, methods=["get"])
    def pdf(self, request, pk=None):
        """
        Return the pdf of the document
        """
        document = self.get_object()
        pdf = DocumentBusiness(document).generate_pdf()

        response = HttpResponse(pdf, content_type="application/pdf")
        response["Content-Disposition"] = "attachment; filename={}.pdf".format(document.name)
        return response

    @action(detail=False, methods=["get"])
    def validate_pdf(self, request, pk=None):
        """
        Return the pdf of the document
        """
        document = self.get_object()
        pdf = DocumentBusiness(None).validate_pdf()
        return Response({"valid": None})
