import { StatusCodes } from 'http-status-codes';

import { redisService } from '@/api/redis/services/redis.service';
import { apiService } from '@/api/util/api/services/api.service';
import { ErrorCode, SuccessCode } from '@/models/code-mapper.model';
import { emptyListResponse } from '@/models/list.model';
import { ResponseStatus, ServiceResponse } from '@/models/service-response.model';
import { handleErrorMessage } from '@/utils/error.util';
import { TimeUnit, toMilliseconds } from '@/utils/time.util';

import { Character, CharacterListResponse } from '../schemas/character.schema';
import { CharactersList, GetCharactersRequest, GetCharactersResponse } from '../schemas/get-character.schema';

const CACHE_KEY = 'characters';

export const rymService = {
  list: async (params: GetCharactersRequest): Promise<GetCharactersResponse> => {
    try {
      const cachedData = await redisService.getData<CharactersList>(CACHE_KEY, params);

      if (cachedData) {
        return new ServiceResponse(
          ResponseStatus.Success,
          'Characters found',
          cachedData,
          StatusCodes.OK,
          SuccessCode.SUCCESS_200
        );
      }

      const characterListResponse = await apiService.get<CharacterListResponse>(
        'https://rickandmortyapi.com/api/character'
      );

      if (!characterListResponse || !characterListResponse.results)
        return new ServiceResponse(
          ResponseStatus.Failed,
          'Characters not found',
          emptyListResponse,
          StatusCodes.NOT_FOUND,
          ErrorCode.GET_CHARACTER_404_0
        );

      const characters = characterListResponse.results.map((character): Character => {
        return character;
      });

      const response: CharactersList = {
        data: characters,
        page: 1,
        pages: 1,
        total: characterListResponse.info.count,
      };

      await redisService.set({
        key: CACHE_KEY,
        params,
        value: JSON.stringify(response),
        expiration: toMilliseconds(1, TimeUnit.HOUR),
      });

      return new ServiceResponse(
        ResponseStatus.Success,
        'Characters found',
        response,
        StatusCodes.OK,
        SuccessCode.SUCCESS_200
      );
    } catch (error) {
      return new ServiceResponse(
        ResponseStatus.Failed,
        handleErrorMessage('Error on get characters', error),
        emptyListResponse,
        StatusCodes.INTERNAL_SERVER_ERROR,
        ErrorCode.UNKNOWN_500
      );
    }
  },

  get: async (id: number): Promise<ServiceResponse<Character | null>> => {
    try {
      const character = await apiService.get<Character>(`https://rickandmortyapi.com/api/character/${id}`);

      if (!character || character.error)
        return new ServiceResponse(
          ResponseStatus.Failed,
          'Character not found',
          null,
          StatusCodes.NOT_FOUND,
          ErrorCode.GET_CHARACTER_404_1
        );

      return new ServiceResponse(
        ResponseStatus.Success,
        'Character found',
        character,
        StatusCodes.OK,
        SuccessCode.SUCCESS_200
      );
    } catch (error) {
      return new ServiceResponse(
        ResponseStatus.Failed,
        handleErrorMessage('Error on get character', error),
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
        ErrorCode.UNKNOWN_500
      );
    }
  },
};
