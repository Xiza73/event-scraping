export const ErrorCode = {
  // Common
  UNKNOWN_400: 'UNKN400',
  UNKNOWN_500: 'UNKN500',
  // User
  USER_NOT_FOUND_404_0: 'UNFD4040',
  // Complete SignUp
  COMPLETE_SIGN_UP_400_0: 'CSGN4000',
  COMPLETE_SIGN_UP_400_1: 'CSGN4001',
  COMPLETE_SIGN_UP_400_2: 'CSGN4002',
  COMPLETE_SIGN_UP_500_0: 'CSGN5000',
  // SignUp
  SIGN_UP_400_0: 'SGNU4000',
  SIGN_UP_500_0: 'SGNU5000',
  SIGN_UP_500_1: 'SGNU5001',
  // SignIn
  SIGN_IN_400_0: 'SGIN4000',
  SIGN_IN_400_1: 'SGIN4001',
  // Auth
  AUTH_MIDDLEWARE_401_0: 'MDLW4010',
  AUTH_MIDDLEWARE_401_1: 'MDLW4011',
  AUTH_MIDDLEWARE_403_0: 'MDLW4030',
  AUTH_MIDDLEWARE_403_1: 'MDLW4031',
  AUTH_MIDDLEWARE_500_0: 'MDLW5000',
  // Update Info
  UPDATE_INFO_400_0: 'UINF4000',
  UPDATE_INFO_404_0: 'UINF4040',
  UPDATE_INFO_500_0: 'UINF5000',
  REPEATED_USER_409_0: 'RUSR4090',
  REPEATED_USER_409_1: 'RUSR4091',
  // Rym
  GET_CHARACTER_404_0: 'GRYM4040',
  GET_CHARACTER_404_1: 'GRYM4041',
  // Event
  GET_EVENTS_404_0: 'GEVT4040',
} as const;
export type ErrorCode = (typeof ErrorCode)[keyof typeof ErrorCode];

export const SuccessCode = {
  // Common
  SUCCESS_200: 'SCSS200',
  SUCCESS_201: 'SCSS201',
  SUCCESS_202: 'SCSS202',
  /* User */
  USER_NO_COMPLETE_PROFILE_200_0: 'UNCP2000',
  USER_COMPLETE_PROFILE_200_0: 'UCPR2000',
  // SignUp
  SIGN_UP_202_0: 'SGNU2020',
  SIGN_UP_201_0: 'SGNU2010',
  // Complete SignUp
  COMPLETE_SIGN_UP_202_0: 'CSGN2020',
  // SignIn
  SIGN_IN_200_0: 'SGIN2000',
} as const;
export type SuccessCode = (typeof SuccessCode)[keyof typeof SuccessCode];

export const ResponseCode = {
  ...ErrorCode,
  ...SuccessCode,
} as const;
export type ResponseCode = (typeof ResponseCode)[keyof typeof ResponseCode];
