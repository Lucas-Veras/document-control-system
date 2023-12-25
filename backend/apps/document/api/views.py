from amqp import NotFound
from django.http import Http404, HttpResponse
from drf_yasg.utils import swagger_auto_schema
from rest_framework import permissions
from rest_framework.decorators import action
from rest_framework.parsers import MultiPartParser
from rest_framework.response import Response

from apps.common.global_drf_viewsets import (
    CustomGenericViewSet,
    CustomListOnlyModelViewSet,
    CustomModelViewSet,
    CustomReadOnlyModelViewSet,
)
from apps.common.global_swagger import list_to_openapi_parameter
from apps.document import models as document_models
from apps.document.api import serializers as document_serializers
from apps.document.api.permissions import (
    DocumentPermissions,
    DocumentUserPermissions,
    PDFPermissions,
)
from apps.document.business import PDFBusiness


class DocumentViewSet(CustomModelViewSet):
    """
    DocumentsViewSet
    """

    queryset = document_models.Document.objects.all()
    permission_classes = [permissions.IsAuthenticated, DocumentPermissions]
    serializer_class = document_serializers.DocumentSerializer


class DocumentUserListViewSet(CustomListOnlyModelViewSet):
    """
    DocumentUserListViewSet
    """

    permission_classes = [permissions.IsAuthenticated, DocumentUserPermissions]
    serializer_class = document_serializers.DocumentSerializer
    queryset = document_models.Document.objects.all()

    def get_queryset(self):
        user_id = self.kwargs["user_pk"]
        return super().get_queryset().filter(user_id=user_id)


class PDFViewSet(CustomGenericViewSet):
    """
    PDFViewSet
    """

    permission_classes = {
        "generate": [permissions.IsAuthenticated, PDFPermissions],
        "generate_signed": [permissions.IsAuthenticated, PDFPermissions],
        "validate_pdf": [permissions.AllowAny],
        "get_by_hash": [permissions.AllowAny],
    }

    @swagger_auto_schema(manual_parameters=list_to_openapi_parameter(["document_id"]))
    @action(detail=False, methods=["post"])
    def generate(self, request):
        """
        Return the pdf of the document
        """
        document_id = request.query_params.get("document_id", None)
        try:
            document = document_models.Document.objects.get(pk=document_id)
        except document_models.Document.DoesNotExist:
            raise Http404("Document not found")

        data = {
            "name": document.name,
            "description": document.description,
        }
        pdf = PDFBusiness(data).generate_pdf()

        response = HttpResponse(pdf, content_type="application/pdf")
        response["Content-Disposition"] = f"attachment; filename=document_{document.id}.pdf"
        return response

    @swagger_auto_schema(manual_parameters=list_to_openapi_parameter(["document_id"]))
    @action(detail=False, methods=["post"])
    def generate_signed(self, request):
        """
        Return the pdf of the document
        """
        document_id = request.query_params.get("document_id", None)
        try:
            document = document_models.Document.objects.get(pk=document_id)
        except document_models.Document.DoesNotExist:
            raise Http404("Document not found")

        data = {
            "name": document.name,
            "description": document.description,
        }
        pdf = PDFBusiness(data).generate_pdf_signed()

        response = HttpResponse(pdf, content_type="application/pdf")
        response["Content-Disposition"] = f"attachment; filename=document_{document.id}.pdf"
        return response

    @action(
        detail=False,
        methods=["post"],
        serializer_class=document_serializers.DocumentInputSerializer,
        parser_classes=(MultiPartParser,),
    )
    def validate_pdf(self, request):
        """
        Verify signature of the pdf
        """
        pdf = request.data.get("file", None)
        status = PDFBusiness().validate_pdf(pdf)
        return Response(status)

    @swagger_auto_schema(manual_parameters=list_to_openapi_parameter(["hash"]))
    @action(
        detail=False,
        methods=["get"],
    )
    def get_by_hash(self, request):
        """
        Verify signature of the pdf
        """
        try:
            hash = request.query_params.get("hash", None)
            pdf = document_models.PDFSignedDocument.objects.get(hash=hash)
        except document_models.PDFSignedDocument.DoesNotExist:
            raise Http404("Hash not found")

        response = HttpResponse(pdf.file.open("rb"), content_type="application/pdf")
        response["Content-Disposition"] = f"attachment; filename=document_{pdf.hash}.pdf"
        return response
