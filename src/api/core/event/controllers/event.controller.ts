import { Request, Response } from 'express';

import { handleServiceResponse } from '@/utils/http-handlers.util';

import { eventService } from '../services/event.service';

export const eventController = {
  getEvents: async (req: Request, res: Response): Promise<void> => {
    const serviceResponse = await eventService.getEvents(req.query);

    handleServiceResponse(serviceResponse, res);
  },
};
