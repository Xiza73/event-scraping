import { z } from '@/config/zod.config';
import { commonValidations } from '@/utils/common-validation.util';

export const UpdateSchema = z.object({
  body: z.object({
    email: commonValidations.email,
  }),
});
export interface UpdateRequest {
  email: string;
  firebaseId: string;
  hasCompletedProfile?: boolean;
}
