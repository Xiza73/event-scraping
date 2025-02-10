import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { Router } from 'express';

import { createApiResponses } from '@/api-docs/openAPIResponseBuilders';
import { Module } from '@/models/module.model';
import { validateRequest } from '@/utils/http-handlers.util';

import { eventController } from '../controllers/event.controller';
import { EventListResponseSchema } from '../schemas/event.schema';
import { GetEventsRequestSchema } from '../schemas/get-events.schema';

export const eventRegistry = new OpenAPIRegistry();

export const eventRouter: Router = (() => {
  const router = Router();

  eventRegistry.registerPath({
    method: 'get',
    path: '/api/event',
    tags: [Module.EVENT],
    responses: createApiResponses([
      {
        schema: EventListResponseSchema,
        statusCode: 200,
      },
    ]),
  });
  router.get('/', validateRequest(GetEventsRequestSchema), eventController.getEvents);

  return router;
})();
