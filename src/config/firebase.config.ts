import admin from 'firebase-admin';

import { SERVICE_ACCOUNT_KEY } from '@/utils/env-config.util';

const serviceAccount = SERVICE_ACCOUNT_KEY;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export { admin };
