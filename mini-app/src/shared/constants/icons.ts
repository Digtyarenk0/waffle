import { SupportedChainId } from 'entities/wallet/model/types/chain';

const iconsChainsPath = './assets/chains';
const iconsTokensPath = './assets/tokens';

export const ICONS_CHAINS: Record<SupportedChainId, string> = {
  [SupportedChainId.POLYGON]: iconsChainsPath + '/polygon.svg',
  [SupportedChainId.ARBITRUM_SEPOLIA]: iconsChainsPath + '/arbitrum.svg',
};

export const ICONS_TOKEN = {
  mock: iconsTokensPath + '/coin.png',
};
