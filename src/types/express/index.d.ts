import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';
import { Multer } from 'multer';

import { RequestUser } from '@/api/user/schemas/user.schema';

export {};

declare global {
  namespace Express {
    export interface Request {
      decodedUser: DecodedIdToken;
      user: RequestUser;
      multer: Multer;
    }
  }
}
