import { JsonRpcProvider } from '@ethersproject/providers';

import { SupportedChainId } from '../../entities/wallet/model/types/chain';

export const RPC_URLS: { [key in SupportedChainId]: string } = {
  [SupportedChainId.AMOY]: 'https://polygon.meowrpc.com',
};

export const RPC_PROVIDERS: { [key in SupportedChainId]: JsonRpcProvider } = {
  [SupportedChainId.AMOY]: new JsonRpcProvider(RPC_URLS[SupportedChainId.AMOY]),
};
