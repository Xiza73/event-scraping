import puppeteer, { Page } from 'puppeteer';

import { logger } from '@/config/logger.config';

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

  async getPage(url: string): Promise<{ page: Page; close: () => Promise<void> }> {
    try {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto(url);

      return { page, close: browser.close.bind(browser) };
    } catch (error) {
      logger.error('Error in puppeteerService.getPage', error);

      throw error;
    }
  },
};
