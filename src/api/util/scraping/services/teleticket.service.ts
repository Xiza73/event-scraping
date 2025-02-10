import { EventResource, IEvent } from '@/api/core/event/schemas/event.schema';
import { redisService } from '@/api/redis/services/redis.service';
import { log } from '@/config/log.config';
import { logger } from '@/config/logger.config';
import { toString } from '@/utils/json.util';
import { TimeUnit, toMilliseconds } from '@/utils/time.util';

import { ResourceService } from '../schemas/resource.schema';
import { puppeteerService } from './puppeteer.service';

export const teleticketService: ResourceService = {
  resource: EventResource.TELETICKET,

  getEvents: async (search) => {
    try {
      log.startTime('teleticketService.getEvents');

      let eventArticles: IEvent[] = [];
      const cachedEvents = await redisService.getData<IEvent[]>(EventResource.TELETICKET);

      if (cachedEvents) {
        eventArticles = cachedEvents;
      } else {
        const url = 'https://teleticket.com.pe/todos/';

        const { page, close } = await puppeteerService.getPage(url);

        eventArticles = await page.$$eval('.listado--eventos article', (elements) => {
          return elements.map((element): IEvent => {
            const url = 'https://teleticket.com.pe';

            const img = element.querySelector('.img--evento')?.getAttribute('src');
            const title = element.querySelector('h3')?.textContent?.trim();
            const date = element.querySelector('.fecha')?.textContent?.trim();
            const href = element.querySelector('a')?.getAttribute('href');

            const link = href.includes('https') ? href : `${url}${element.querySelector('a')?.getAttribute('href')}`;

            return {
              img,
              title,
              date,
              link,
              resource: 'teleticket',
            };
          });
        });

        await close();
      }

      const uniqueEvents = eventArticles.filter((event, index, self) => {
        return index === self.findIndex((e) => e.title === event.title);
      });

      await redisService.set({
        key: EventResource.TELETICKET,
        value: toString(uniqueEvents),
        expiration: toMilliseconds(1, TimeUnit.HOUR),
      });

      if (search) {
        return uniqueEvents.filter(
          (event) =>
            event.title.toLowerCase().includes(search!.toLowerCase()) ||
            event.date?.toLowerCase().includes(search!.toLowerCase())
        );
      }

      return uniqueEvents;
    } catch (error) {
      logger.error('Error in teleticketService.getEvents', error);

      throw error;
    } finally {
      log.endTime('teleticketService.getEvents');
    }
  },
};
