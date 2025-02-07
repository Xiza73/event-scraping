import { z } from '@/config/zod.config';

export const ListSchema = z.object({
  query: z.object({
    page: z.number(),
    limit: z.number(),
  }),
});
export interface ListRequest {
  page?: number;
  limit?: number;
}

export interface ListResponse<T> {
  data: T[];
  total: number;
  pages: number;
  page: number;
}

export const emptyListResponse: ListResponse<null> = { data: [], total: 0, pages: 0, page: 0 };
