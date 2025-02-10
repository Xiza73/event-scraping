import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { Router } from 'express';

import { createApiResponses } from '@/api-docs/openAPIResponseBuilders';
import { Module } from '@/models/module.model';

import { rymController } from '../controllers/rym.controller';
import { CharacterListResponseSchema, CharacterSchema } from '../schemas/character.schema';

export const rymRegistry = new OpenAPIRegistry();

export const rymRouter: Router = (() => {
  const router = Router();

  rymRegistry.registerPath({
    method: 'get',
    path: '/api/rym/character',
    tags: [Module.RYM],
    responses: createApiResponses([
      {
        schema: CharacterListResponseSchema,
        statusCode: 200,
      },
    ]),
  });
  router.get('/character', rymController.list);

  rymRegistry.registerPath({
    method: 'get',
    path: '/api/rym/character/{id}',
    tags: [Module.RYM],
    responses: createApiResponses([
      {
        schema: CharacterSchema,
        statusCode: 200,
      },
    ]),
  });
  router.get('/character/:id', rymController.get);

  return router;
})();
