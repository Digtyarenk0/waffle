import { MAINNET_CHAIN_IDS, SupportedChainId } from 'entities/wallet/model/types/chain';

export const isMainnetChain = (chainId: SupportedChainId): boolean => {
  return MAINNET_CHAIN_IDS[chainId];
};
