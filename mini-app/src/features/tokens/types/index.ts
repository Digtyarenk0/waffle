import { SupportedChainId } from 'entities/wallet/model/types/chain';
import { MulticallCallData } from 'entities/web3/model/types/contracts';

import { ITokenList } from '../model/store';

export type RecordCalls = { calls: MulticallCallData[]; tokens: ITokenList[] };

export type CallDataByTokenList = Record<SupportedChainId, RecordCalls | null> | undefined;
