from django.core.management.base import BaseCommand

from apps.common.global_pdf_sing import PDFSigner


class Command(BaseCommand):
    help = "Generate certificates for the project"

    def handle(self, *args, **options):
        PDFSigner(None)._generate_certs()
