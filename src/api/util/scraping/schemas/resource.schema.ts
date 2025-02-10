import { EventResource, IEvent } from '@/api/core/event/schemas/event.schema';

export interface ResourceService {
  resource: EventResource;
  getEvents: (search?: string) => Promise<IEvent[]>;
}
