from io import BytesIO

import pdfkit
from django.template.loader import get_template

from apps.common.global_pdf_sing import PDFSigner


class DocumentBusiness:
    def __init__(self, instance, serializer_data={}):
        self.instance = instance
        self.serializer_data = serializer_data

    def generate_pdf(self):
        template = get_template("default_pdf.html")
        context = {"name": self.instance.name, "description": self.instance.description}
        html = template.render(context)
        pdf = pdfkit.from_string(html, False)

        signed = self.generate_pdfa(pdf)
        return signed

    def generate_pdfa(self, pdf):
        pdfa = PDFSigner(pdf).sign()
        return pdfa
