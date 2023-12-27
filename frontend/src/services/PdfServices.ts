import { privateApi } from "../infra/api";
import { constructUrl } from "../utils/constructUrl";

class PdfService {
  async pdfGenerate(id: number) {
    const url = constructUrl({
      url: `/pdf/generate/?document_id=${id}`,
    });
    const response = await privateApi.post(url, null, {
      responseType: "arraybuffer",
    });
    return response.data;
  }

  async signedPdfGenerate(id: number) {
    const url = constructUrl({
      url: `/pdf/generate_signed/?document_id=${id}`,
    });
    const response = await privateApi.post(url, null, {
      responseType: "arraybuffer",
    });
    return response.data;
  }

  async validatePdf(file: FormData) {
    const response = await privateApi.post("/pdf/validate_pdf/", file, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  }
}

export default new PdfService();
