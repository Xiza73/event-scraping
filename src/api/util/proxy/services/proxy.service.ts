import { logger } from '@/config/logger.config';
import { handleErrorMessage } from '@/utils/error.util';

import { apiService } from '../../api/services/api.service';
import { ApiProxyList, Proxy } from '../schemas/proxy.schema';

export const proxyService = {
  getProxies: async (): Promise<Proxy[]> => {
    try {
      const response = await apiService.get<ApiProxyList>(
        'https://proxylist.geonode.com/api/proxy-list?protocols=http&limit=500&page=1&sort_by=lastChecked&sort_type=desc'
      );

      const proxies: Proxy[] = response.data
        .filter((proxy) => {
          const upTime = parseInt(proxy.upTime, 10);

          return upTime > 95;
        })
        .map((proxy) => {
          const protocol = proxy.protocols[0];
          const url = `${protocol}://${proxy.ip}`;

          return {
            url,
            port: parseInt(proxy.port, 10),
          };
        });

      return proxies;
    } catch (error) {
      logger.error(handleErrorMessage('Error in proxyService.getProxies', error));

      throw error;
    }
  },
};
