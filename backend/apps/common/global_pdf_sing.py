import time
import uuid
from io import BytesIO

import OpenSSL
from pyhanko import stamp
from pyhanko.keys import load_cert_from_pemder
from pyhanko.pdf_utils.incremental_writer import IncrementalPdfFileWriter
from pyhanko.pdf_utils.reader import PdfFileReader
from pyhanko.sign import fields, signers
from pyhanko.sign.validation import read_certification_data, validate_pdf_signature
from pyhanko_certvalidator import ValidationContext


class PDFSigner:
    def __init__(self, pdf, username=None):
        self.pdf = pdf
        self.username = username
        self.cert_pem_path = f"./keys/{username}_certificate.cer"
        self.key_pem_path = f"./keys/{username}_private_key.pem"
        self.public_key_pem_path = f"./keys/{username}_public_key.pem"

    def _create_key_pair(self):
        pkey = OpenSSL.crypto.PKey()
        pkey.generate_key(OpenSSL.crypto.TYPE_RSA, 4096)
        return pkey

    def _create_self_signed_cert(self, pKey):
        """Create a self signed certificate. This certificate will not require to be signed by a Certificate Authority."""
        # Create a self signed certificate
        cert = OpenSSL.crypto.X509()
        cert.get_subject().CN = self.username
        cert.set_serial_number(int(time.time() * 10))
        cert.gmtime_adj_notBefore(0)
        cert.gmtime_adj_notAfter(10 * 365 * 24 * 60 * 60)
        cert.set_issuer((cert.get_subject()))
        cert.set_pubkey(pKey)
        cert.sign(pKey, "sha256")
        return cert

    def load_certs(self):
        """Generate the certificate"""
        key = self._create_key_pair()

        with open(self.key_pem_path, "wb+") as pk:
            if pk.read() == b"":
                pk_str = OpenSSL.crypto.dump_privatekey(OpenSSL.crypto.FILETYPE_PEM, key)
                pk.write(pk_str)

        cert = self._create_self_signed_cert(key)
        with open(self.cert_pem_path, "wb+") as cer:
            if cer.read() == b"":
                cer_str = OpenSSL.crypto.dump_certificate(OpenSSL.crypto.FILETYPE_PEM, cert)
                cer.write(cer_str)

        with open(self.public_key_pem_path, "wb+") as pub_key:
            if pub_key.read() == b"":
                pub_key_str = OpenSSL.crypto.dump_publickey(OpenSSL.crypto.FILETYPE_PEM, cert.get_pubkey())
                pub_key.write(pub_key_str)

    def sign(self):
        self.load_certs()
        signer = signers.SimpleSigner.load(
            self.key_pem_path, self.cert_pem_path, ca_chain_files=(), key_passphrase=None
        )

        w = IncrementalPdfFileWriter(BytesIO(self.pdf))
        fields.append_signature_field(w, sig_field_spec=fields.SigFieldSpec("Signature", box=(100, 100, 500, 160)))

        _hash = uuid.uuid4().hex

        meta = signers.PdfSignatureMetadata(field_name="Signature", name=self.username)
        pdf_signer = signers.PdfSigner(
            meta,
            signer=signer,
            stamp_style=stamp.QRStampStyle(
                stamp_text="Assinado por: %(signer)s\nData: %(ts)s\nURL: %(url)s",
            ),
        )

        out = BytesIO()
        pdf_signer.sign_pdf(
            w,
            output=out,
            appearance_text_params={"url": f"http://localhost:8000/api/v1/pdf/get_by_hash/?hash={_hash}"},
        )

        return out.read(), _hash

    def validate(self):
        r = PdfFileReader(self.pdf)
        if len(r.embedded_signatures) == 0:
            return {
                "by": None,
                "valid": False,
                "intact": False,
                "md_algorithm": None,
                "signed_at": None,
            }
        sig = r.embedded_signatures[0]
        self.username = sig.__dict__["sig_object"]["/Name"]
        self.cert_pem_path = f"./keys/{self.username}_certificate.cer"

        cert = load_cert_from_pemder(self.cert_pem_path)
        vc = ValidationContext(trust_roots=[cert])
        status = validate_pdf_signature(sig, vc)
        return {
            "by": self.username,
            "valid": status.valid,
            "intact": status.intact,
            "md_algorithm": status.md_algorithm,
            "signed_at": status.signer_reported_dt,
        }
