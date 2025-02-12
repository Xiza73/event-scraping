export interface ApiProxy {
  ip: string;
  port: string;
  protocols: string[];
  upTime: string;
}

export interface ApiProxyList {
  data: ApiProxy[];
}

export interface Proxy {
  url: string;
  port: number;
}
