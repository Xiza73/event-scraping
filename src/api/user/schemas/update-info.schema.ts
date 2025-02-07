import { z } from '@/config/zod.config';

export const UpdateInfoSchema = z.object({
  body: z.object({
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
    phoneNumber: z
      .string({
        required_error: 'Phone number is required',
        invalid_type_error: 'Phone number must be a string',
      })
      .min(9),
  }),
});
export interface UpdateInfoRequest {
  firebaseId: string;
  name: string;
  lastName: string;
  username: string;
  phoneNumber: string;
}
