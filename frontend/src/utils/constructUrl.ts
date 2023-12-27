import { IUrlParams } from "../interfaces/IGetOptions";

export const constructUrl = ({ url, ordering, page, per_page }: IUrlParams) => {
  const queryParams = [];

  if (ordering) queryParams.push(`ordering=${ordering}`);

  if (page) queryParams.push(`page=${page}`);

  if (per_page) queryParams.push(`per_page=${per_page}`);

  if (queryParams.length > 0) {
    const queryString = queryParams.join("&");
    url += url.includes("?") ? `&${queryString}` : `?${queryString}`;
  }

  return url;
};
