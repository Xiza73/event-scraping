export const cleanInterface = <T extends K, K extends object>(obj: T, myClass: { new (): K }): any => {
  const keys = Object.keys(new myClass());

  return keys.reduce((acc: Partial<K>, key: string) => {
    acc[key as keyof K] = obj[key as keyof K];

    return acc;
  }, {} as Partial<K>);
};
