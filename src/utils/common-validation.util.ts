// import mongoose from 'mongoose';
import { z } from 'zod';

export const commonValidations = {
  // id: z
  //   .string({ required_error: 'ID is required', invalid_type_error: 'ID must be a string' })
  //   .refine((data) => !isNaN(Number(data)), 'ID must be a numeric value')
  //   .transform(Number)
  //   .refine((num) => num > 0, 'ID must be a positive number'),

  // _id: z
  //   .string({ required_error: 'ID is required', invalid_type_error: 'ID must be a string' })
  //   .refine((data) => !isNaN(Number(data)), 'ID must be a numeric value')
  //   .transform(Number)
  //   .refine((id) => mongoose.Types.ObjectId.isValid(id), 'Invalid ID'),

  email: z
    .string({
      required_error: 'Email is required',
      invalid_type_error: 'Email must be a string',
    })
    .min(3, 'Email must be at least 3 characters long')
    .max(255, 'Email must be at most 255 characters long')
    .email('Invalid email address')
    .transform((data) => data.toLowerCase()),

  firebaseId: z.string({
    required_error: 'Firebase ID is required',
    invalid_type_error: 'Firebase ID must be a string',
  }),

  optionalString: z.string().optional(),

  // page: z.number().int().positive().optional(),
  // first try to parse the value as a number, then check if it's an integer, then check if it's positive
  // page: z
  //   .string()
  //   .refine((data) => !isNaN(Number(data)), 'Page must be a numeric value')
  //   .transform(Number)
  //   .refine((num) => num > 0, 'Page must be a positive number')
  //   .refine((num) => Number.isInteger(num), 'Page must be an integer')
  //   .optional(),

  // limit: z
  //   .string()
  //   .refine((data) => !isNaN(Number(data)), 'Limit must be a numeric value')
  //   .transform(Number)
  //   .refine((num) => num > 0, 'Limit must be a positive number')
  //   .refine((num) => Number.isInteger(num), 'Limit must be an integer')
  //   .optional(),
};
