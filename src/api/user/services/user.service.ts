import { StatusCodes } from 'http-status-codes';

import { ErrorCode, SuccessCode } from '@/models/code-mapper.model';
import { ResponseStatus, ServiceResponse } from '@/models/service-response.model';
import { handleErrorMessage } from '@/utils/error.util';

import { userRepository } from '../repositories/user.repository';
import { HandleRepeatedParams } from '../schemas/handle-repeated.schema';
import { UpdateInfoRequest } from '../schemas/update-info.schema';

export const userHelperService = {
  handleRepeatedIssue: async ({ firebaseId, phoneNumber, username }: HandleRepeatedParams) => {
    const existWithPhone = await userRepository.findRepeatedPhone(firebaseId, phoneNumber);

    if (existWithPhone)
      return new ServiceResponse(
        ResponseStatus.Failed,
        'El número de teléfono ya está en uso por otro usuario',
        null,
        StatusCodes.CONFLICT,
        ErrorCode.REPEATED_USER_409_0
      );

    const existWithUsername = await userRepository.findRepeatedUsername(firebaseId, username);

    if (existWithUsername)
      return new ServiceResponse(
        ResponseStatus.Failed,
        'El nombre de usuario ya está en uso por otro usuario',
        null,
        StatusCodes.CONFLICT,
        ErrorCode.REPEATED_USER_409_1
      );
  },
};

export const userService = {
  getUserByFirebaseId: async (firebaseId: string) => {
    try {
      const user = await userRepository.findByFirebaseId(firebaseId);

      if (!user) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          'User not found',
          null,
          StatusCodes.NOT_FOUND,
          ErrorCode.USER_NOT_FOUND_404_0
        );
      }

      // Condición para verificar si el perfil está completo
      if (!user.hasCompletedProfile) {
        return new ServiceResponse(
          ResponseStatus.Success,
          'User profile is incomplete',
          { isActive: user.isActive, hasCompletedProfile: user.hasCompletedProfile },
          StatusCodes.OK,
          SuccessCode.USER_NO_COMPLETE_PROFILE_200_0
        );
      }

      // Si el perfil está completo, devolver todos los datos del usuario
      return new ServiceResponse(
        ResponseStatus.Success,
        'User profile retrieved successfully',
        user, // Retornamos el usuario completo
        StatusCodes.OK,
        SuccessCode.USER_COMPLETE_PROFILE_200_0
      );
    } catch (error) {
      return new ServiceResponse(
        ResponseStatus.Failed,
        handleErrorMessage('Error retrieving user', error),
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
        ErrorCode.UNKNOWN_500
      );
    }
  },

  updateInfo: async (data: UpdateInfoRequest) => {
    try {
      if (!data.firebaseId) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          'Firebase ID is required',
          null,
          StatusCodes.BAD_REQUEST,
          ErrorCode.UPDATE_INFO_400_0
        );
      }

      const user = await userRepository.findByFirebaseId(data.firebaseId);

      if (!user) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          'User not found',
          null,
          StatusCodes.NOT_FOUND,
          ErrorCode.UPDATE_INFO_404_0
        );
      }

      const repeatedIssue = await userHelperService.handleRepeatedIssue(data);

      if (repeatedIssue) return repeatedIssue;

      const updatedUser = await userRepository.updateInfo(user._id.toString(), data);

      if (!updatedUser) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          'Error on update user',
          null,
          StatusCodes.INTERNAL_SERVER_ERROR,
          ErrorCode.UPDATE_INFO_500_0
        );
      }

      return new ServiceResponse(
        ResponseStatus.Success,
        'User updated successfully',
        null,
        StatusCodes.OK,
        SuccessCode.SUCCESS_200
      );
    } catch (error) {
      return new ServiceResponse(
        ResponseStatus.Failed,
        handleErrorMessage('Error on update user', error),
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
        ErrorCode.UNKNOWN_500
      );
    }
  },
};
