import { PaginationQueryDto } from "./pagination.dto.js";

export function getPagination(query: PaginationQueryDto) {

  const page =
    Number(query.page ?? 1);

  const limit =
    Number(query.limit ?? 10);

  return {
    page,
    limit,

    offset: (page - 1) * limit,
  };
}