import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { SuccessCode } from '@/models/code-mapper.model';
import { ResponseStatus, ServiceResponse } from '@/models/service-response.model';
import { handleServiceResponse } from '@/utils/http-handlers.util';

import { authService } from '../services/auth.service';

export const authController = {
  checkSession: async (_req: Request, res: Response): Promise<void> => {
    handleServiceResponse(
      new ServiceResponse(ResponseStatus.Success, 'Session is active', null, StatusCodes.OK, SuccessCode.SUCCESS_200),
      res
    );
  },

  signUp: async (req: Request, res: Response): Promise<void> => {
    const { email, firebaseId } = req.user;

    const serviceResponse = await authService.signUp({
      email,
      firebaseId,
    });

    handleServiceResponse(serviceResponse, res);
  },

  signIn: async (req: Request, res: Response): Promise<void> => {
    const serviceResponse = await authService.signIn(req.user.firebaseId);

    handleServiceResponse(serviceResponse, res);
  },

  completeSignUp: async (req: Request, res: Response): Promise<void> => {
    const { firebaseId } = req.user;

    const serviceResponse = await authService.completeSignUp({
      ...req.body,
      firebaseId,
    });

    handleServiceResponse(serviceResponse, res);
  },
};
