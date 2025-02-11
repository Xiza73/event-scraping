import { EventResource, IEvent } from '@/api/core/event/schemas/event.schema';
import { redisService } from '@/api/redis/services/redis.service';
import { log } from '@/config/log.config';
import { logger } from '@/config/logger.config';
import { toString } from '@/utils/json.util';
import { TimeUnit, toSeconds } from '@/utils/time.util';

import { ResourceService } from '../schemas/resource.schema';
import { puppeteerService } from './puppeteer.service';

interface TicketmasterService extends ResourceService {
  getMainEvents: () => Promise<IEvent[]>;
  getWithFilter: (search: string) => Promise<IEvent[]>;
}

export const ticketmasterService: TicketmasterService = {
  resource: EventResource.TICKETMASTER,

  getMainEvents: async () => {
    const cachedEvents = await redisService.getData<IEvent[]>(EventResource.TICKETMASTER);

    if (cachedEvents) {
      return cachedEvents;
    }

    const url = 'https://www.ticketmaster.pe/';

    const { page, close } = await puppeteerService.getPage(url);

    const eventArticles = (
      await page.$$eval('.events_grid a.grid_element', (elements) => {
        return elements.map((element): IEvent => {
          const url = 'https://www.ticketmaster.pe';

          const img = element.querySelector('.image img')?.getAttribute('src');
          const title = element.querySelector('.details h3')?.textContent?.trim();
          const spanDetail = element.querySelector('.details span')?.textContent?.trim();
          const strongDetail = element.querySelector('.details strong')?.textContent?.trim();
          const details = [spanDetail, strongDetail].filter((detail) => detail).join('\n');

          const href = element.getAttribute('href');
          const link = href.startsWith('..') ? `${url}${href.replace(/[^a-zA-Z0-9/-]+/g, '')}` : href;

          return {
            img,
            title,
            details,
            link,
            resource: 'ticketmaster',
          };
        });
      })
    ).filter((event) => event.img && event.title && event.details && event.link);

    await close();

    const uniqueEvents = eventArticles
      .filter((event, index, self) => {
        return index === self.findIndex((e) => e.title === event.title);
      })
      .filter((event) => !event.link.includes('venue') && !event.link.includes('dashboard'));

    await redisService.set({
      key: EventResource.TICKETMASTER,
      value: toString(uniqueEvents),
      expiration: toSeconds(1, TimeUnit.HOUR),
    });

    return uniqueEvents;
  },

  getWithFilter: async (search) => {
    const cachedEvents = await redisService.getData<IEvent[]>(EventResource.TICKETMASTER, { search });

    if (cachedEvents) {
      return cachedEvents;
    }

    const url = `https://www.ticketmaster.pe/list/${search}`;

    const { page, close } = await puppeteerService.getPage(url);

    const eventArticles = (
      await page.$$eval('.event_list div div div a', (elements) => {
        return elements.map((element): IEvent => {
          const url = 'https://www.ticketmaster.pe';

          const img = element.querySelector('.show-thumb div img')?.getAttribute('src');
          const title = element.querySelector('.show-thumb .show-info h2')?.textContent?.trim();
          const details = element.querySelector('.show-thumb .show-info h3')?.textContent?.trim();

          const href = element.getAttribute('href');
          const link = href.startsWith('..') ? `${url}${href.replace(/[^a-zA-Z0-9/-]+/g, '')}` : href;

          return {
            img,
            title,
            details,
            link,
            resource: 'ticketmaster',
          };
        });
      })
    ).filter((event) => event.img && event.title && event.details && event.link);

    await close();

    await redisService.set({
      key: EventResource.TICKETMASTER,
      params: { search },
      value: toString(eventArticles),
      expiration: toSeconds(1, TimeUnit.HOUR),
    });

    return eventArticles;
  },

  getEvents: async (search) => {
    try {
      log.startTime('ticketmasterService.getEvents');

      return search ? await ticketmasterService.getWithFilter(search) : await ticketmasterService.getMainEvents();
    } catch (error) {
      logger.error('Error in ticketmasterService.getEvents', error);

      throw error;
    } finally {
      log.endTime('ticketmasterService.getEvents');
    }
  },
};
