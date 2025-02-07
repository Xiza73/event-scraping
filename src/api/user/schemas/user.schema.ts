import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';

import { z } from '@/config/zod.config';

export const UserSchema = z.object({
  _id: z.string(),
  email: z.string(),
  firebaseId: z.string(),
  name: z.string(),
  lastName: z.string(),
  username: z.string(),
  phoneNumber: z.string(),
  hasCompletedProfile: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export interface RequestUser {
  _id?: string;
  email: string;
  firebaseId: string;
  name?: string;
  lastName?: string;
  username?: string;
  phoneNumber?: string;
  hasCompletedProfile?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class UserResponse {
  email = '';
  name?: string;
  lastName?: string;
  username?: string;
  phoneNumber?: string;
  hasCompletedProfile?: boolean;
}

export class GetUserResponse {
  email = '';
  name?: string;
  lastName?: string;
  username?: string;
  phoneNumber?: string;
  hasCompletedProfile?: boolean;
}

export const getUserFromDecodedToken = (decodedToken: DecodedIdToken): RequestUser => {
  if (!decodedToken || !decodedToken.uid || !decodedToken.email) throw new Error('Invalid decoded token');

  return {
    firebaseId: decodedToken.uid,
    email: decodedToken.email,
  };
};
