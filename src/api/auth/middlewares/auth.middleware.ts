import { NextFunction, Request, Response } from 'express';
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';
import { StatusCodes } from 'http-status-codes';

import { userRepository } from '@/api/user/repositories/user.repository';
import { getUserFromDecodedToken } from '@/api/user/schemas/user.schema';
import { admin } from '@/config/firebase.config';
import { ErrorCode } from '@/models/code-mapper.model';
import { ResponseStatus, ServiceResponse } from '@/models/service-response.model';
import { handleErrorMessage } from '@/utils/error.util';
import { handleServiceResponse } from '@/utils/http-handlers.util';

import { getBearerToken } from '../utils/token.util';

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = getBearerToken(req);

    if (!token) {
      handleServiceResponse(
        new ServiceResponse(
          ResponseStatus.Failed,
          'Token was not provided',
          null,
          StatusCodes.UNAUTHORIZED,
          ErrorCode.AUTH_MIDDLEWARE_401_0
        ),
        res
      );

      return;
    }

    const decodedToken: DecodedIdToken = await admin.auth().verifyIdToken(token);

    req.decodedUser = decodedToken;
    req.user = getUserFromDecodedToken(decodedToken);

    next();
  } catch (err) {
    handleServiceResponse(
      new ServiceResponse(
        ResponseStatus.Failed,
        handleErrorMessage('Invalid token error', err),
        null,
        StatusCodes.UNAUTHORIZED,
        ErrorCode.AUTH_MIDDLEWARE_401_1
      ),
      res
    );
  }
};

export const adminOnly = async (req: Request, res: Response, next: NextFunction) =>
  await authenticate(req, res, async () => {
    try {
      const user = await userRepository.findByFirebaseId(req.decodedUser.uid);

      if (!user?.isAdmin)
        return handleServiceResponse(
          new ServiceResponse(
            ResponseStatus.Failed,
            'Unauthorized access',
            null,
            StatusCodes.FORBIDDEN,
            ErrorCode.AUTH_MIDDLEWARE_403_0
          ),
          res
        );

      next();
    } catch (error) {
      return handleServiceResponse(
        new ServiceResponse(
          ResponseStatus.Failed,
          handleErrorMessage('Error checking admin access', error),
          null,
          StatusCodes.INTERNAL_SERVER_ERROR,
          ErrorCode.AUTH_MIDDLEWARE_500_0
        ),
        res
      );
    }
  });
