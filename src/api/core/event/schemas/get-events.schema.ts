import { z } from '@/config/zod.config';
import { EmptyListResponse, ListRequest, ListResponse, ListSchema } from '@/models/list.model';
import { ServiceResponse } from '@/models/service-response.model';

import { EventResource, IEvent } from './event.schema';

export const GetEventsFilterSchema = z.object({
  search: z.string().optional(),
  resource: z.nativeEnum(EventResource).optional(),
});

export const GetEventsRequestSchema = z.object({
  query: z.object({
    ...ListSchema.shape,
    ...GetEventsFilterSchema.shape,
  }),
});
export interface GetEventsRequest extends ListRequest {
  search?: string;
  resource?: EventResource;
}

export type EventList = ListResponse<IEvent>;

export type GetEventsResponse = ServiceResponse<EventList | EmptyListResponse>;
