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

export const toSeconds = (time: number, unit: TimeUnit = TimeUnit.HOUR): number => {
  switch (unit) {
    case TimeUnit.SECOND:
      return time;
    case TimeUnit.MINUTE:
      return time * 60;
    case TimeUnit.HOUR:
      return time * 60 * 60;
  }
};
