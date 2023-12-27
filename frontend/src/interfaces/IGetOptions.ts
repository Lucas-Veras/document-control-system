export interface IUrlParams {
  url: string;
  ordering?: string;
  page?: number;
  per_page?: number;
}

export type IGetOptions = Omit<IUrlParams, "url">;

export type IGetMyDocuments = Omit<IUrlParams, "url"> & {
  id: number;
};
