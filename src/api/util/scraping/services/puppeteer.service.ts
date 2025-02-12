import puppeteer, { Page } from 'puppeteer';

import { logger } from '@/config/logger.config';
import { env } from '@/utils/env-config.util';

export const puppeteerService = {
  async getHtml(url: string): Promise<string> {
    try {
      const browser = await puppeteer.launch();

      const page = await browser.newPage();
      await page.goto(url);

      const html = await page.content();

      await browser.close();

      return html;
    } catch (error) {
      logger.error('Error in puppeteerService.getHtml', error);

      throw error;
    }
  },

  async getHtmlWithSelector(url: string, selector: string): Promise<string> {
    try {
      const browser = await puppeteer.launch();

      const page = await browser.newPage();
      await page.goto(url);

      await page.waitForSelector(selector);

      const html = await page.content();

      await browser.close();

      return html;
    } catch (error) {
      logger.error('Error in puppeteerService.getHtmlWithSelector', error);

      throw error;
    }
  },

  async getPage(url: string, withTime: boolean = false): Promise<{ page: Page; close: () => Promise<void> }> {
    try {
      let browser;
      let page;

      if (env.PROXY_ON) {
        browser = await puppeteer.launch({
          args: [
            `--proxy-server=${env.PROXY_URL}`,
            // `--proxy-username=${env.PROXY_USERNAME}`,
            // `--proxy-password=${env.PROXY_PASSWORD}`,
          ],
        });

        page = await browser.newPage();

        page.authenticate({
          username: env.PROXY_USERNAME,
          password: env.PROXY_PASSWORD,
        });
      } else {
        browser = await puppeteer.launch({
          args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });

        page = await browser.newPage();
      }

      if (withTime) {
        await page.goto(url, { waitUntil: 'networkidle2' });
      } else {
        await page.goto(url);
      }

      return { page, close: browser.close.bind(browser) };
    } catch (error) {
      logger.error('Error in puppeteerService.getPage', error);

      throw error;
    }
  },
};
