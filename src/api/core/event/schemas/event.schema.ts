import { z } from '@/config/zod.config';

export const EventResource = {
  TELETICKET: 'teleticket',
  TICKETMASTER: 'ticketmaster',
} as const;
export type EventResource = (typeof EventResource)[keyof typeof EventResource];

export const ApiEventSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  url: z.string(),
  image: z.string(),
  date: z.date(),
});
export interface ApiEvent {
  id: number;
  title: string;
  description: string;
  url: string;
  image: string;
  date: Date;
  created: Date;
  error?: string;
}

export interface ApiEventListResponse {
  results: ApiEvent[];
}

export const EventSchema = z.object({
  id: z.number().optional(),
  title: z.string(),
  img: z.string(),
  details: z.string().optional(),
  date: z.string().optional(),
  link: z.string(),
  resource: z.string(),
  error: z.string().optional(),
});
export interface IEvent {
  id?: number;
  title: string;
  img: string;
  details?: string;
  date?: string;
  link: string;
  resource: EventResource;
  error?: string;
}

export const EventListResponseSchema = z.object({
  data: z.array(EventSchema),
  total: z.number(),
  page: z.number(),
  pages: z.number(),
});
