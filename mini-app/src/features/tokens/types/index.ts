import { SupportedChainId } from 'entities/wallet/model/types/chain';
import { MulticallCallData } from 'entities/web3/model/types/contracts';

import { ITokenList } from '../model/store';

export type CallDataByTokenList =
  | Record<SupportedChainId, { calls: MulticallCallData[]; tokens: ITokenList[] } | null>
  | undefined;
