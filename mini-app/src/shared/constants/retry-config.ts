import { Options } from 'async-retry';

// eslint-disable-next-line
const onRetry: Options['onRetry'] = (_e, attempt) => console.log(`ATTEMPT ${attempt}`);

// 3 attempts within ~6 seconds
export const RETRY_OPTIONS_LOW: Options = {
  // @ts-ignore
  minTimeout: 150,
  factor: 3.8875,
  onRetry: onRetry,
  retries: 3,
};

// 10 attempts within ~40 seconds
export const RETRY_OPTIONS_HIGH: Options = {
  // @ts-ignore
  minTimeout: 500,
  factor: 1.33223,
  onRetry: onRetry,
  retries: 10,
};

// 3 attempts within ~25 seconds
export const RETRY_OPTIONS_TRANSACTION: Options = {
  // @ts-ignore
  minTimeout: 1000,
  factor: 3.8875,
  onRetry: onRetry,
  retries: 3,
};

// new attempt each 3 sec
export const RETRY_OPTIONS_SUBGRAPH: Options = {
  // @ts-ignore
  minTimeout: 3000,
  factor: 1,
  retries: 5,
};
