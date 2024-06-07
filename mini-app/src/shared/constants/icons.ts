import { SupportedChainId } from 'entities/wallet/model/types/chain';

const iconsChainsPath = './assets/chains';

export const ICONS_CHAINS: Record<SupportedChainId, string> = {
  [SupportedChainId.POLYGON]: iconsChainsPath + '/polygon.svg',
  [SupportedChainId.ARBITRUM_SEPOLIA]: iconsChainsPath + '/arbitrum.svg',
};
