import { SupportedChainId } from 'entities/wallet/model/types/chain';

const iconsChainsPath = 'assets/chains';
const iconsTokensPath = 'assets/tokens';
const iconsUIPath = 'assets/icons';

export const ICONS_CHAINS: Record<SupportedChainId, string> = {
  [SupportedChainId.POLYGON]: iconsChainsPath + '/polygon.svg',
  [SupportedChainId.ARBITRUM_SEPOLIA]: iconsChainsPath + '/arbitrum.svg',
};

export const ICONS_TOKEN = {
  mock: iconsTokensPath + '/coin.png',
};

export const ICONS_UI = {
  stake: iconsUIPath + '/stake.svg',
  swap: iconsUIPath + '/swap.svg',
  home: iconsUIPath + '/home.svg',
  copy: iconsUIPath + '/copy.svg',
  scan: iconsUIPath + '/scan.svg',
  waffle: iconsUIPath + '/waffle.svg',
};
