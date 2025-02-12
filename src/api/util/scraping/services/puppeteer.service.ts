import { anonymizeProxy, closeAnonymizedProxy } from 'proxy-chain';
import puppeteer, { Page } from 'puppeteer';

import { logger } from '@/config/logger.config';
import { env } from '@/utils/env-config.util';
import { handleErrorMessage } from '@/utils/error.util';

import { proxyService } from '../../proxy/services/proxy.service';

const MAX_RETRIES = 3;

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

  async getPage(url: string, _withTime: boolean = false): Promise<{ page: Page; close: () => Promise<void> }> {
    try {
      let browser;
      let page;

      let currentRetry = 0;
      let anonymizedProxyUrl: string;

      const proxyUrls = await proxyService.getProxies();

      if (env.PROXY_ON) {
        while (currentRetry < MAX_RETRIES) {
          try {
            // const newProxyUrl = await proxyChain.anonymizeProxy(proxyUrls[currentRetry]);
            const randomProxyUrl = proxyUrls[Math.floor(Math.random() * proxyUrls.length)];
            const { url, port } = randomProxyUrl;

            anonymizedProxyUrl = await anonymizeProxy({
              url,
              port,
            });

            browser = await puppeteer.launch({
              args: [
                `--proxy-server=${anonymizedProxyUrl}`,
                // '--no-sandbox',
                // '--ignore-certificate-errors',
                // '--ignore-certificate-errors-spki-list',
              ],
            });

            page = await browser.newPage();

            break;
          } catch (error) {
            logger.error('Error in try puppeteerService.getPage', error);

            currentRetry += 1;

            if (currentRetry === MAX_RETRIES) {
              throw new Error(error as string);
            }
          }
        }
      } else {
        browser = await puppeteer.launch({
          args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });

        page = await browser.newPage();
      }

      if (!browser) {
        throw new Error('Browser not found');
      }

      if (!page) {
        throw new Error('Page not found');
      }

      await page.goto(url, { waitUntil: 'networkidle2' });

      const close = async () => {
        await browser.close();

        if (env.PROXY_ON && anonymizedProxyUrl) {
          await closeAnonymizedProxy(anonymizedProxyUrl, true);
        }
      };

      return { page, close };
    } catch (error) {
      logger.error(handleErrorMessage('Error in puppeteerService.getPage', error));

      throw error;
    }
  },
};
