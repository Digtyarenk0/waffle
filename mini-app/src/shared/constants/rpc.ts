import { JsonRpcProvider } from '@ethersproject/providers';

import { SupportedChainId } from '../../entities/wallet/model/types/chain';

export const RPC_URLS: { [key in SupportedChainId]: string } = {
  [SupportedChainId.POLYGON]: 'https://polygon.meowrpc.com',
  [SupportedChainId.ARBITRUM_SEPOLIA]: 'https://sepolia-rollup.arbitrum.io/rpc',
};

export const RPC_PROVIDERS: { [key in SupportedChainId]: JsonRpcProvider } = {
  [SupportedChainId.POLYGON]: new JsonRpcProvider(RPC_URLS[SupportedChainId.POLYGON]),
  [SupportedChainId.ARBITRUM_SEPOLIA]: new JsonRpcProvider(RPC_URLS[SupportedChainId.ARBITRUM_SEPOLIA]),
};
