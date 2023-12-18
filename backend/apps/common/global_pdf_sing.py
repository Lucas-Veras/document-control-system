import io
import time

import OpenSSL
import PyPDF2
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.asymmetric import padding
from cryptography.hazmat.primitives.serialization import load_pem_private_key
from cryptography.x509 import load_pem_x509_certificate
from PyPDF2.generic import AnnotationBuilder


class PDFSigner:
    def __init__(self, pdf):
        self.pdf = pdf
        self.cert_pem_path = "./keys/certificate.cer"
        self.key_pem_path = "./keys/private_key.pem"

    def _create_key_pair(self, type, bits):
        """
        Create a public/private key pair
        Arguments: Type - Key Type, must be one of TYPE_RSA and TYPE_DSA
                bits - Number of bits to use in the key (1024 or 2048 or 4096)
        Returns: The public/private key pair in a PKey object
        """
        pkey = OpenSSL.crypto.PKey()
        pkey.generate_key(type, bits)
        return pkey

    def _create_self_signed_cert(self, pKey):
        """Create a self signed certificate. This certificate will not require to be signed by a Certificate Authority."""
        # Create a self signed certificate
        cert = OpenSSL.crypto.X509()
        # Common Name (e.g. server FQDN or Your Name)
        cert.get_subject().CN = "DOCS SERVER"
        # Serial Number
        cert.set_serial_number(int(time.time() * 10))
        # Not Before
        cert.gmtime_adj_notBefore(0)  # Not before
        # Not After (Expire after 10 years)
        cert.gmtime_adj_notAfter(10 * 365 * 24 * 60 * 60)
        # Identify issue
        cert.set_issuer((cert.get_subject()))
        cert.set_pubkey(pKey)
        cert.sign(pKey, "sha256")  # or cert.sign(pKey, 'sha256')
        return cert

    def load(self):
        """Generate the certificate"""
        summary = {}
        summary["OpenSSL Version"] = OpenSSL.__version__
        # Generating a Private Key...
        key = self._create_key_pair(OpenSSL.crypto.TYPE_RSA, 1024)
        # PEM encoded
        with open(self.key_pem_path, "wb") as pk:
            pk_str = OpenSSL.crypto.dump_privatekey(OpenSSL.crypto.FILETYPE_PEM, key)
            pk.write(pk_str)
            summary["Private Key"] = pk_str
        # Done - Generating a private key...
        # Generating a self-signed client certification...
        cert = self._create_self_signed_cert(pKey=key)
        with open(self.cert_pem_path, "wb") as cer:
            cer_str = OpenSSL.crypto.dump_certificate(OpenSSL.crypto.FILETYPE_PEM, cert)
            cer.write(cer_str)
            summary["Self Signed Certificate"] = cer_str
        # Done - Generating a self-signed client certification...
        # Generating the public key...
        with open("./keys/public_key.pem", "wb") as pub_key:
            pub_key_str = OpenSSL.crypto.dump_publickey(OpenSSL.crypto.FILETYPE_PEM, cert.get_pubkey())
            # print("Public key = ",pub_key_str)
            pub_key.write(pub_key_str)
            summary["Public Key"] = pub_key_str
        # Done - Generating the public key...
        # Take a private key and a certificate and combine them into a PKCS12 file.
        # Generating a container file of the private key and the certificate...
        p12 = OpenSSL.crypto.PKCS12()
        p12.set_privatekey(key)
        p12.set_certificate(cert)
        open("./keys/container.pfx", "wb").write(p12.export())
        # You may convert a PKSC12 file (.pfx) to a PEM format
        # Done - Generating a container file of the private key and the certificate...
        # To Display A Summary
        print("## Initialization Summary ##################################################")
        print("\n".join("{}:{}".format(i, j) for i, j in summary.items()))
        print("############################################################################")
        return True

    def sign(
        self,
    ):
        with open(self.cert_pem_path, "rb") as cert_file:
            cert_data = cert_file.read()
            cert = load_pem_x509_certificate(cert_data, default_backend())

        with open(self.key_pem_path, "rb") as key_file:
            key_data = key_file.read()
            key = load_pem_private_key(key_data, password=None, backend=default_backend())

        # Criar um objeto PDFReader
        pdf_reader = PyPDF2.PdfReader(io.BytesIO(self.pdf))

        # Criar um objeto PDFWriter
        pdf_writer = PyPDF2.PdfWriter()

        # Adicionar todas as páginas do PDF original ao PDFWriter
        for page_num in range(len(pdf_reader.pages)):
            page = pdf_reader.pages[page_num]
            pdf_writer.add_page(page)

        # Criar um hash SHA-256 do conteúdo do PDF
        sha256 = hashes.Hash(hashes.SHA256(), default_backend())
        for page_num in range(len(pdf_reader.pages)):
            sha256.update(pdf_reader.pages[page_num].extract_text().encode("utf-8"))
        pdf_hash = sha256.finalize()

        # Assinar o hash usando a chave privada
        signature = key.sign(pdf_hash, padding.PKCS1v15(), hashes.SHA256())

        # Adicionar uma página em branco
        pdf_writer.add_blank_page()
        last_page = pdf_writer.pages[-1]

        # Adiciona na ultima página "assinado digitalmente. hash: {pdf_hash}"
        annotation = AnnotationBuilder.free_text(
            f"Assinado digitalmente. hash: {pdf_hash}",
            rect=(50, 550, 300, 150),
            font="Arial",
            bold=True,
            italic=True,
            font_size="20pt",
            font_color="000000",
            background_color="ffffff",
        )
        pdf_writer.add_annotation(page_number=0, annotation=annotation)

        # Adicionar a assinatura ao dicionário de anotações
        pdf_writer.update_page_form_field_values(
            last_page,
            {
                "/Type": "/Annot",
                "/Subtype": "/Widget",
                "/Rect": [0, 0, 0, 0],
                "/P": last_page,
                "/T": "signature1",
                "/V": last_page,
                "/F": 132,
                "/AP": last_page,
                "/AS": "/Sig",
                "/Sig": {
                    "/Type": "/Sig",
                    "/Filter": "/Adobe.PPKLite",
                    "/SubFilter": "/adbe.pkcs7.detached",
                    "/ByteRange": [
                        0,
                        len(self.pdf),
                        len(self.pdf) + len(signature),
                        len(self.pdf) + len(signature),
                    ],
                    "/Contents": signature,
                },
            },
        )

        # Salvar o PDF assinado
        signed_pdf_bytes = io.BytesIO()
        pdf_writer.write(signed_pdf_bytes)
        signed_pdf_bytes.seek(0)

        return signed_pdf_bytes


if __name__ == "__main__":
    PDFSigner(None).load()
