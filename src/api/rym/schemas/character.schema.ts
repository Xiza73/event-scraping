import { z } from '@/config/zod.config';

export interface Origin {
  name: string;
  url: string;
}

export interface Location {
  name: string;
  url: string;
}

export interface Character {
  id: number;
  name: string;
  status: string;
  species: string;
  type: string;
  gender: string;
  origin: Origin;
  location: Location;
  image: string;
  episode: string[];
  url: string;
  created: Date;
  error?: string;
}

export interface Info {
  count: number;
  pages: number;
  next: string | null;
  prev: string | null;
}

export interface CharacterListResponse {
  info: Info;
  results: Character[];
}

export const CharacterSchema = z.object({
  id: z.number(),
  name: z.string(),
  status: z.string(),
  species: z.string(),
  type: z.string(),
  gender: z.string(),
  origin: z.object({
    name: z.string(),
    url: z.string(),
  }),
  location: z.object({
    name: z.string(),
    url: z.string(),
  }),
  image: z.string(),
  episode: z.array(z.string()),
  url: z.string(),
  created: z.date(),
});

export const CharacterListResponseSchema = z.object({
  data: z.array(CharacterSchema),
  total: z.number(),
  pages: z.number(),
  page: z.number(),
});
