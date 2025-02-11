import { EventResource, IEvent } from '@/api/core/event/schemas/event.schema';
import { redisService } from '@/api/redis/services/redis.service';
import { log } from '@/config/log.config';
import { TimeUnit, toSeconds } from '@/utils/time.util';

import { ResourceServiceWithFilter } from '../schemas/resource.schema';
import { autoScroll } from '../utils/scrapin.util';
import { puppeteerService } from './puppeteer.service';

export const joinnusService: ResourceServiceWithFilter = {
  resource: EventResource.JOINNUS,

  getMainEvents: async () => {
    const cachedEvents = await redisService.getData<IEvent[]>(EventResource.JOINNUS);

    if (cachedEvents) {
      return cachedEvents;
    }

    const url = 'https://www.joinnus.com/';

    const { page, close } = await puppeteerService.getPage(url, true);

    await page.click('.dm_button');
    await autoScroll(page);

    const eventArticles = (
      await page.$$eval('.card-event-content a.card-event', (elements) => {
        return elements.map((element): IEvent => {
          const url = 'https://www.joinnus.com';

          const img = element.querySelector('.card-event__img img')?.getAttribute('src');
          const title = element.querySelector('.card-event__body h3 strong')?.textContent?.trim();
          const date = element.querySelector('.card-event__body div .card-event__calendar div')?.textContent?.trim();

          const href = element.getAttribute('href');
          const link = href.startsWith('/') ? `${url}${href}` : href;

          return {
            img,
            title,
            date,
            link,
            resource: 'joinnus',
          };
        });
      })
    ).filter((event) => event.img && event.title && event.date && event.link);

    await close();

    const uniqueEvents = eventArticles.filter((event, index, self) => {
      return index === self.findIndex((e) => e.title === event.title);
    });

    await redisService.set({
      key: EventResource.JOINNUS,
      value: JSON.stringify(uniqueEvents),
      expiration: toSeconds(1, TimeUnit.HOUR),
    });

    return uniqueEvents;
  },

  getWithFilter: async (search) => {
    const cachedEvents = await redisService.getData<IEvent[]>(EventResource.JOINNUS, { search });

    if (cachedEvents) {
      return cachedEvents;
    }

    const url = `https://www.joinnus.com/search?searchKey=${encodeURIComponent(
      JSON.stringify({
        text: search,
        maps: false,
        filters: {
          price: { min: '', max: '' },
          categories: [],
          dates: { key: 'all', dateStart: new Date().toISOString(), dateEnd: new Date().toISOString() },
          location: { z: 12, center: { lat: -12.074317294768308, lng: -77.04348643769534 } },
          city: [],
        },
        page: 1,
        country: 'PE',
      })
    )}`;

    const { page, close } = await puppeteerService.getPage(url, true);

    await autoScroll(page);

    const eventArticles = (
      await page.$$eval('.card-event-content a.card-event', (elements) => {
        return elements.map((element): IEvent => {
          const url = 'https://www.joinnus.com';

          const img = element.querySelector('.card-event__img img')?.getAttribute('src');
          const title = element.querySelector('.card-event__body h3 strong')?.textContent?.trim();
          const date = element.querySelector('.card-event__body div .card-event__calendar div')?.textContent?.trim();

          const href = element.getAttribute('href');
          const link = href.startsWith('/') ? `${url}${href}` : href;

          return {
            img,
            title,
            date,
            link,
            resource: 'joinnus',
          };
        });
      })
    ).filter((event) => event.img && event.title && event.date && event.link);

    await close();

    await redisService.set({
      key: EventResource.JOINNUS,
      params: { search },
      value: JSON.stringify(eventArticles),
      expiration: toSeconds(1, TimeUnit.HOUR),
    });

    return eventArticles;
  },

  getEvents: async (search) => {
    try {
      log.startTime('joinnusService.getEvents');

      return search ? await joinnusService.getWithFilter(search) : await joinnusService.getMainEvents();
    } catch (error) {
      log.error('joinnusService.getEvents', error);

      throw error;
    } finally {
      log.endTime('joinnusService.getEvents');
    }
  },
};
