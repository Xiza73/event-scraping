export const handleErrorMessage = (prefix: string, error: any): string => {
  if (error instanceof Error) return `${prefix}: ${error.message}`;

  return prefix;
};
