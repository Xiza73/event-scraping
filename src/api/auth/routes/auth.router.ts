import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';

import { UserSchema } from '@/api/user/schemas/user.schema';
import { createApiResponses } from '@/api-docs/openAPIResponseBuilders';
import { Module } from '@/models/module.model';
import { Method } from '@/models/route.model';
import { validateRequest } from '@/utils/http-handlers.util';

import { authController } from '../controllers/auth.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { CompleteSignUpSchema } from '../schemas/sign-up.schema';

export const authRegistry = new OpenAPIRegistry();

export const authRouter: Router = (() => {
  const router = Router();

  authRegistry.registerPath({
    method: Method.GET,
    path: '/api/auth/check-session',
    tags: [Module.AUTH],
    responses: createApiResponses([
      {
        schema: z.object({
          message: z.string(),
        }),
        statusCode: StatusCodes.OK,
      },
    ]),
  });
  router.get('/check-session', authController.checkSession);

  authRegistry.registerPath({
    method: Method.POST,
    path: '/api/auth/sign-up',
    tags: [Module.AUTH],
    requestBody: {
      content: {
        'application/json': {
          example: z.object({
            email: z.string(),
          }),
        },
      },
    },
    responses: createApiResponses([
      {
        schema: z.null(),
        statusCode: StatusCodes.CREATED,
      },
    ]),
  });
  router.post('/sign-up', authenticate, authController.signUp);

  authRegistry.registerPath({
    method: Method.GET,
    path: '/api/auth/sign-in',
    tags: [Module.AUTH],
    responses: createApiResponses([
      {
        schema: z.null(),
        statusCode: StatusCodes.OK,
      },
    ]),
  });
  router.get('/sign-in', authenticate, authController.signIn);

  authRegistry.registerPath({
    method: Method.POST,
    path: '/api/auth/complete-sign-up',
    tags: [Module.AUTH],
    requestBody: {
      content: {
        'application/json': {
          example: {
            email: z.string(),
            name: z.string().min(4),
            lastName: z.string().min(4),
            username: z.string().min(4),
            phoneNumber: z.string().min(9),
          },
        },
      },
    },
    responses: createApiResponses([
      {
        schema: UserSchema,
        statusCode: StatusCodes.ACCEPTED,
      },
    ]),
  });
  router.post('/complete-sign-up', authenticate, validateRequest(CompleteSignUpSchema), authController.completeSignUp);

  return router;
})();
