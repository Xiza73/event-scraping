import { StatusCodes } from 'http-status-codes';

import { User } from '@/api/user/models/user.model';
import { userRepository } from '@/api/user/repositories/user.repository';
import { UserResponse } from '@/api/user/schemas/user.schema';
import { userHelperService } from '@/api/user/services/user.service';
import { ErrorCode, SuccessCode } from '@/models/code-mapper.model';
import { ResponseStatus, ServiceResponse } from '@/models/service-response.model';
import { handleErrorMessage } from '@/utils/error.util';
import { cleanInterface } from '@/utils/transform.util';

import { CompleteSignUpRequest, SignUpRequest } from '../schemas/sign-up.schema';

export const authService = {
  signUp: async (data: SignUpRequest): Promise<ServiceResponse<null>> => {
    try {
      if (!data.email)
        return new ServiceResponse(
          ResponseStatus.Failed,
          'Email was not provided',
          null,
          StatusCodes.BAD_REQUEST,
          ErrorCode.SIGN_UP_400_0
        );

      let user = await userRepository.findByEmail(data.email);

      if (user) {
        if (user.firebaseId !== data.firebaseId) {
          user = await userRepository.partialUpdateInfo(user._id.toString(), data);

          if (!user)
            return new ServiceResponse(
              ResponseStatus.Failed,
              'Error on update user',
              null,
              StatusCodes.INTERNAL_SERVER_ERROR,
              ErrorCode.SIGN_UP_500_0
            );
        }

        return new ServiceResponse(
          ResponseStatus.Success,
          'User already registered',
          null,
          StatusCodes.ACCEPTED,
          SuccessCode.SIGN_UP_202_0
        );
      }

      const newUser = await userRepository.create(data);

      if (!newUser)
        return new ServiceResponse(
          ResponseStatus.Failed,
          'Error on create user',
          null,
          StatusCodes.INTERNAL_SERVER_ERROR,
          ErrorCode.SIGN_UP_500_1
        );

      return new ServiceResponse(
        ResponseStatus.Success,
        'User registered',
        null,
        StatusCodes.CREATED,
        SuccessCode.SIGN_UP_201_0
      );
    } catch (error) {
      return new ServiceResponse(
        ResponseStatus.Failed,
        handleErrorMessage('Error on create user', error),
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
        ErrorCode.UNKNOWN_500
      );
    }
  },

  signIn: async (firebaseId: string): Promise<ServiceResponse<UserResponse | null>> => {
    try {
      const user = await userRepository.findByFirebaseId(firebaseId);

      if (!user)
        return new ServiceResponse(
          ResponseStatus.Failed,
          'User not found',
          null,
          StatusCodes.BAD_REQUEST,
          ErrorCode.SIGN_IN_400_0
        );

      const userResponse: UserResponse = cleanInterface(user, UserResponse);

      return new ServiceResponse(
        ResponseStatus.Success,
        'User found',
        userResponse,
        StatusCodes.OK,
        SuccessCode.SIGN_IN_200_0
      );
    } catch (error) {
      return new ServiceResponse(
        ResponseStatus.Failed,
        handleErrorMessage('Error on sign in', error),
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
        ErrorCode.UNKNOWN_500
      );
    }
  },

  completeSignUp: async (data: CompleteSignUpRequest): Promise<ServiceResponse<User | null>> => {
    try {
      const user = await userRepository.findByFirebaseId(data.firebaseId);

      if (!user)
        return new ServiceResponse(
          ResponseStatus.Failed,
          'User not found',
          null,
          StatusCodes.BAD_REQUEST,
          ErrorCode.COMPLETE_SIGN_UP_400_0
        );

      if (user.hasCompletedProfile)
        return new ServiceResponse(
          ResponseStatus.Failed,
          'User already completed profile',
          null,
          StatusCodes.BAD_REQUEST,
          ErrorCode.COMPLETE_SIGN_UP_400_1
        );

      const repeatedIssue = await userHelperService.handleRepeatedIssue(data);

      if (repeatedIssue) return repeatedIssue;

      const updatedUser = await userRepository.completeSignUp(user._id.toString(), data);

      if (!updatedUser)
        return new ServiceResponse(
          ResponseStatus.Failed,
          'Error on update user',
          null,
          StatusCodes.INTERNAL_SERVER_ERROR,
          ErrorCode.COMPLETE_SIGN_UP_500_0
        );

      const userResponse = cleanInterface(updatedUser, UserResponse);

      return new ServiceResponse(
        ResponseStatus.Success,
        'User verified',
        userResponse,
        StatusCodes.ACCEPTED,
        SuccessCode.COMPLETE_SIGN_UP_202_0
      );
    } catch (error) {
      return new ServiceResponse(
        ResponseStatus.Failed,
        handleErrorMessage('Error on complete sign up', error),
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
        ErrorCode.UNKNOWN_500
      );
    }
  },
};
