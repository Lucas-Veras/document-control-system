import { privateApi } from "../infra/api";
import { IGetMyDocuments } from "../interfaces/IGetOptions";
import { constructUrl } from "../utils/constructUrl";

class DocumentService {
  async getMyDocuments({ id, ordering, page, per_page }: IGetMyDocuments) {
    const url = constructUrl({
      url: `/user/${id}/document/`,
      ordering,
      page,
      per_page,
    });
    const response = await privateApi.get(url);
    return response.data;
  }

  async createDocument({
    name,
    description,
  }: {
    name: string;
    description: string;
  }) {
    const url = constructUrl({
      url: `/document/`,
    });
    const response = await privateApi.post(url, {
      name,
      description,
    });
    return response.data;
  }
}

export default new DocumentService();
