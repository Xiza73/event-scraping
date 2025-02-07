import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ZodError, ZodSchema } from 'zod';

import { ErrorCode } from '../models/code-mapper.model';
import { ResponseStatus, ServiceResponse } from '../models/service-response.model';

export const handleServiceResponse = (serviceResponse: ServiceResponse<any>, response: Response) => {
  return response.status(serviceResponse.statusCode).send(serviceResponse);
};

export const validateRequest = (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
  try {
    schema.parse({ body: req.body, query: req.query, params: req.params });

    next();
  } catch (err) {
    const firstError = (err as ZodError).errors[0];
    const errorMessage = `Invalid input for ${firstError.path.join('.')}: ${firstError.message}`;
    const statusCode = StatusCodes.BAD_REQUEST;

    res
      .status(statusCode)
      .send(new ServiceResponse<null>(ResponseStatus.Failed, errorMessage, null, statusCode, ErrorCode.UNKNOWN_400));
  }
};
