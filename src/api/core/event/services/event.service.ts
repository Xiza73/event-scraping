import { StatusCodes } from 'http-status-codes';

import { ResourceService } from '@/api/util/scraping/schemas/resource.schema';
import { joinnusService } from '@/api/util/scraping/services/joinnus.service';
import { teleticketService } from '@/api/util/scraping/services/teleticket.service';
import { ticketmasterService } from '@/api/util/scraping/services/ticketmaster.service';
import { ErrorCode, SuccessCode } from '@/models/code-mapper.model';
import { emptyListResponse } from '@/models/list.model';
import { ResponseStatus, ServiceResponse } from '@/models/service-response.model';
import { handleErrorMessage } from '@/utils/error.util';
import { cleanSymbols } from '@/utils/string.util';

import { IEvent } from '../schemas/event.schema';
import { GetEventsRequest, GetEventsResponse } from '../schemas/get-events.schema';

export const eventService = {
  getEvents: async (query: GetEventsRequest): Promise<GetEventsResponse> => {
    try {
      let resourceServices: ResourceService[] = [teleticketService, ticketmasterService, joinnusService];
      let eventsData: IEvent[] = [];

      if (query.resource) resourceServices = resourceServices.filter((service) => service.resource === query.resource);

      await Promise.all(
        resourceServices.map(async (service) => {
          const events = await service.getEvents(query.search);
          eventsData = [...eventsData, ...events];
        })
      );

      if (!eventsData.length) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          'Events not found',
          emptyListResponse,
          StatusCodes.NOT_FOUND,
          ErrorCode.GET_EVENTS_404_0
        );
      }

      eventsData.sort((a, b) => cleanSymbols(a.title).localeCompare(cleanSymbols(b.title)));

      const { page, limit } = query;
      const curentPage = page || 1;
      const curentLimit = limit || 10;
      const pages = Math.ceil(eventsData.length / curentLimit);
      const total = eventsData.length;

      const start = (curentPage - 1) * curentLimit;
      const end = start + curentLimit;

      eventsData = eventsData.slice(start, end);

      return new ServiceResponse(
        ResponseStatus.Success,
        'Events fetched successfully',
        {
          data: eventsData,
          page: curentPage,
          pages,
          total,
        },
        StatusCodes.OK,
        SuccessCode.SUCCESS_200
      );
    } catch (error) {
      return new ServiceResponse(
        ResponseStatus.Failed,
        handleErrorMessage('Error getting events', error),
        emptyListResponse,
        StatusCodes.INTERNAL_SERVER_ERROR,
        ErrorCode.UNKNOWN_500
      );
    }
  },
};
