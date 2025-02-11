import { EventResource, IEvent } from '@/api/core/event/schemas/event.schema';

export interface ResourceService {
  resource: EventResource;
  getEvents: (search?: string) => Promise<IEvent[]>;
}

export interface ResourceServiceWithFilter extends ResourceService {
  getMainEvents: () => Promise<IEvent[]>;
  getWithFilter: (search: string) => Promise<IEvent[]>;
}
