from io import BytesIO

import pdfkit
from django.core.files import File
from django.template.loader import get_template

from apps.common.global_pdf_sing import PDFSigner
from apps.document.models import PDFSignedDocument


class PDFBusiness:
    def __init__(self, serializer_data={}):
        self.serializer_data = serializer_data

    def generate_pdf(self, template_name="default_pdf.html", save=True):
        template = get_template(template_name)
        context = {
            "name": self.serializer_data.get("name", None),
            "description": self.serializer_data.get("description", None),
        }
        html = template.render(context)
        pdf = pdfkit.from_string(html, False)

        return pdf

    def generate_pdf_signed(self, template_name="default_pdf.html", save=True):
        pdf = self.generate_pdf(template_name, save)
        pdfa, _hash = PDFSigner(pdf).sign()
        orm_object = PDFSignedDocument()
        orm_object.hash = _hash
        orm_object.file = File(pdfa, name=f"{_hash}.pdf")
        orm_object.save()
        return pdfa

    def validate_pdf(self, pdf):
        pdfa = PDFSigner(pdf).validate()
        return pdfa
