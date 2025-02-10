import { Request, Response } from 'express';

import { handleServiceResponse } from '@/utils/http-handlers.util';

import { rymService } from '../services/rym.service';

export const rymController = {
  list: async (req: Request, res: Response): Promise<void> => {
    const query = req.query;
    const body = req.body;

    const serviceResponse = await rymService.list({
      ...query,
      ...body,
    });

    handleServiceResponse(serviceResponse, res);
  },

  get: async (req: Request, res: Response): Promise<void> => {
    const serviceResponse = await rymService.get(req.params.id as unknown as number);

    handleServiceResponse(serviceResponse, res);
  },
};
