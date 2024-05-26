import { JsonRpcProvider } from 'ethers';

import { SupportedChainId } from '../types/chain';

export const RPC_URLS: { [key in SupportedChainId]: string } = {
  [SupportedChainId.AMOY]: 'https://rpc.ankr.com/polygon_amoy',
};

export const RPC_PROVIDERS: { [key in SupportedChainId]: JsonRpcProvider } = {
  [SupportedChainId.AMOY]: new JsonRpcProvider(RPC_URLS[SupportedChainId.AMOY]),
};
