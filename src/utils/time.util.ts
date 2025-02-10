export enum TimeUnit {
  SECOND = 'second',
  MINUTE = 'minute',
  HOUR = 'hour',
}

export const toMilliseconds = (time: number, unit: TimeUnit = TimeUnit.SECOND): number => {
  switch (unit) {
    case TimeUnit.SECOND:
      return time * 1000;
    case TimeUnit.MINUTE:
      return time * 1000 * 60;
    case TimeUnit.HOUR:
      return time * 1000 * 60 * 60;
  }
};
