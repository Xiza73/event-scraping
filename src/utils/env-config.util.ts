import dotenv from 'dotenv';
import { cleanEnv, host, num, port, str, testOnly } from 'envalid';
import { ServiceAccount } from 'firebase-admin';

dotenv.config();

export const env = cleanEnv(process.env, {
  // Environment Configuration
  NODE_ENV: str({ devDefault: testOnly('test'), choices: ['development', 'production', 'test', 'local'] }),
  PORT: port({ devDefault: testOnly(3000) }),
  HOST: host({ devDefault: testOnly('localhost') }),

  // CORS Settings
  CORS_ORIGIN: str({ devDefault: testOnly('http://localhost:3000') }),
  WHITE_LIST_URLS: str(),

  // Rate Limit
  COMMON_RATE_LIMIT_WINDOW_MS: num({ devDefault: testOnly(1000) }),
  COMMON_RATE_LIMIT_MAX_REQUESTS: num({ devDefault: testOnly(1000) }),

  // Database Configuration
  DB_URI: str({ devDefault: testOnly('mongodb://localhost:27017/test') }),

  // Session Configuration
  JWT_SECRET: str(),

  // Firebase
  SERVICE_ACCOUNT_KEY_TYPE: str(),
  SERVICE_ACCOUNT_KEY_PROJECT_ID: str(),
  SERVICE_ACCOUNT_KEY_PRIVATE_KEY_ID: str(),
  SERVICE_ACCOUNT_KEY_PRIVATE_KEY: str(),
  SERVICE_ACCOUNT_KEY_CLIENT_EMAIL: str(),
  SERVICE_ACCOUNT_KEY_CLIENT_ID: str(),
  SERVICE_ACCOUNT_KEY_AUTH_URI: str(),
  SERVICE_ACCOUNT_KEY_TOKEN_URI: str(),
  SERVICE_ACCOUNT_KEY_AUTH_PROVIDER_X509_CERT_URL: str(),
  SERVICE_ACCOUNT_KEY_CLIENT_X509_CERT_URL: str(),
  SERVICE_ACCOUNT_KEY_UNIVERSE_DOMAIN: str(),

  // Test variables
  TEST_ALT_EMAIL: str(),
  TEST_EMAIL: str(),
  TEST_PASSWORD: str(),

  // Other variables
  FRONTEND_URL: str(),
});
export const SERVICE_ACCOUNT_KEY: ServiceAccount = {
  projectId: env.SERVICE_ACCOUNT_KEY_PROJECT_ID,
  clientEmail: env.SERVICE_ACCOUNT_KEY_CLIENT_EMAIL,
  privateKey: env.SERVICE_ACCOUNT_KEY_PRIVATE_KEY.replace(/\\n/g, '\n'),
};
