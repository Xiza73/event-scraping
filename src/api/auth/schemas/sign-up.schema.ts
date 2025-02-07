import { z } from '@/config/zod.config';
import { commonValidations } from '@/utils/common-validation.util';

export interface SignUpRequest {
  email: string;
  firebaseId: string;
}

export const CompleteSignUpSchema = z.object({
  body: z.object({
    email: commonValidations.email,
    name: z
      .string({
        required_error: 'Name is required',
        invalid_type_error: 'Name must be a string',
      })
      .min(4),
    lastName: z
      .string({
        required_error: 'Last name is required',
        invalid_type_error: 'Last name must be a string',
      })
      .min(4),
    username: z
      .string({
        required_error: 'Username is required',
        invalid_type_error: 'Username must be a string',
      })
      .min(4),
    phoneNumber: z.string().optional(),
  }),
});
export interface CompleteSignUpRequest {
  firebaseId: string;
  email: string;
  name: string;
  lastName: string;
  username: string;
  phoneNumber: string;
}
