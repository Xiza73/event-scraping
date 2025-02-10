import { z } from '@/config/zod.config';

export const ListSchema = z.object({
  page: z
    .string()
    .refine((v) => !v || !isNaN(Number(v)), { message: 'Page must be a number' })
    .transform((v) => Number(v))
    .transform((v) => (v < 1 ? 1 : v))
    .transform((v) => Math.floor(v)),
  limit: z
    .string()
    .refine((v) => !v || !isNaN(Number(v)), { message: 'Limit must be a number' })
    .transform((v) => Number(v))
    .transform((v) => (v > 100 ? 100 : v))
    .transform((v) => Math.floor(v)),
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

export type EmptyListResponse = ListResponse<null>;

export const emptyListResponse: EmptyListResponse = { data: [], total: 0, pages: 0, page: 0 };
