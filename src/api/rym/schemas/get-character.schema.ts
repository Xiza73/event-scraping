import { Character } from '@/api/rym/schemas/character.schema';
import { z } from '@/config/zod.config';
import { ListRequest, ListResponse, ListSchema } from '@/models/list.model';
import { ServiceResponse } from '@/models/service-response.model';

export const GetCharactersSchema = z.object({
  ...ListSchema.shape,
  body: z.object({
    search: z.string().optional(),
  }),
});
export interface GetCharactersRequest extends ListRequest {
  search?: string;
}

export type CharactersList = ListResponse<Character | null>;

export type GetCharactersResponse = ServiceResponse<CharactersList>;
