import hashlib
import time
import uuid
from io import BytesIO

import OpenSSL
from pyhanko import stamp
from pyhanko.keys import load_cert_from_pemder
from pyhanko.pdf_utils.incremental_writer import IncrementalPdfFileWriter
from pyhanko.pdf_utils.reader import PdfFileReader
from pyhanko.sign import fields, signers
from pyhanko.sign.validation import validate_pdf_signature
from pyhanko_certvalidator import ValidationContext


class PDFSigner:
    def __init__(self, pdf):
        self.pdf = pdf
        self.cert_pem_path = "./keys/certificate.cer"
        self.key_pem_path = "./keys/private_key.pem"
        self.public_key_pem_path = "./keys/public_key.pem"

    def _create_key_pair(self, type, bits):
        """
        Create a public/private key pair
        Arguments: Type - Key Type, must be one of TYPE_RSA and TYPE_DSA
                bits - Number of bits to use in the key (1024 or 2048 or 4096)
        Returns: The public/private key pair in a PKey object
        """
        pkey = OpenSSL.crypto.PKey()
        pkey.generate_key(type, 4096)
        return pkey

    def _create_self_signed_cert(self, pKey):
        """Create a self signed certificate. This certificate will not require to be signed by a Certificate Authority."""
        # Create a self signed certificate
        cert = OpenSSL.crypto.X509()
        cert.get_subject().CN = "DOCS SERVER"
        cert.set_serial_number(int(time.time() * 10))
        cert.gmtime_adj_notBefore(0)
        cert.gmtime_adj_notAfter(10 * 365 * 24 * 60 * 60)
        cert.set_issuer((cert.get_subject()))
        cert.set_pubkey(pKey)
        cert.sign(pKey, "sha256")
        return cert

    def _generate_certs(self):
        """Generate the certificate"""
        summary = {}
        summary["OpenSSL Version"] = OpenSSL.__version__
        key = self._create_key_pair(OpenSSL.crypto.TYPE_RSA, 1024)

        # PEM encoded
        with open(self.key_pem_path, "wb") as pk:
            pk_str = OpenSSL.crypto.dump_privatekey(OpenSSL.crypto.FILETYPE_PEM, key)
            pk.write(pk_str)
            summary["Private Key"] = pk_str

        cert = self._create_self_signed_cert(pKey=key)
        with open(self.cert_pem_path, "wb") as cer:
            cer_str = OpenSSL.crypto.dump_certificate(OpenSSL.crypto.FILETYPE_PEM, cert)
            cer.write(cer_str)
            summary["Self Signed Certificate"] = cer_str

        with open(self.public_key_pem_path, "wb") as pub_key:
            pub_key_str = OpenSSL.crypto.dump_publickey(OpenSSL.crypto.FILETYPE_PEM, cert.get_pubkey())
            pub_key.write(pub_key_str)
            summary["Public Key"] = pub_key_str

        p12 = OpenSSL.crypto.PKCS12()
        p12.set_privatekey(key)
        p12.set_certificate(cert)
        return True

    def sign(self):
        signer = signers.SimpleSigner.load(
            self.key_pem_path, self.cert_pem_path, ca_chain_files=(), key_passphrase=None
        )

        w = IncrementalPdfFileWriter(BytesIO(self.pdf))
        fields.append_signature_field(w, sig_field_spec=fields.SigFieldSpec("Signature", box=(100, 100, 500, 160)))

        _hash = uuid.uuid4().hex

        meta = signers.PdfSignatureMetadata(field_name="Signature")
        pdf_signer = signers.PdfSigner(
            meta,
            signer=signer,
            stamp_style=stamp.QRStampStyle(
                stamp_text="Assinado por: %(signer)s\nData: %(ts)s\nURL: %(url)s",
            ),
        )

        out = BytesIO()
        pdf_signer.sign_pdf(
            w, output=out, appearance_text_params={"url": f"https://example.com/document-validation?hash={_hash}"}
        )

        return out, _hash

    def validate(self):
        cert = load_cert_from_pemder(self.cert_pem_path)
        vc = ValidationContext(trust_roots=[cert])

        r = PdfFileReader(self.pdf)
        if len(r.embedded_signatures) == 0:
            return {
                "valid": False,
                "intact": False,
                "md_algorithm": None,
                "signed_at": None,
            }
        sig = r.embedded_signatures[0]
        status = validate_pdf_signature(sig, vc)
        return {
            "valid": status.valid,
            "intact": status.intact,
            "md_algorithm": status.md_algorithm,
            "signed_at": status.signer_reported_dt,
        }


if __name__ == "__main__":
    PDFSigner(None)._generate_certs()
