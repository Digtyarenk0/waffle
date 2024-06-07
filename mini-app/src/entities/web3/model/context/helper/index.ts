import { Provider } from '@ethersproject/abstract-provider/src.ts';
import { Web3Provider } from '@ethersproject/providers';
import retry from 'async-retry';

import { RETRY_OPTIONS_HIGH } from 'shared/constants/retry-config';

export const getBlockNumber = (provider: Web3Provider | Provider): Promise<number> =>
  retry(() => provider.getBlockNumber(), RETRY_OPTIONS_HIGH);
