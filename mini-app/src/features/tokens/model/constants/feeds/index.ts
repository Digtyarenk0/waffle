import { SupportedChainId } from 'entities/wallet/model/types/chain';

import { ARBIRTRUM_SEPOLIA_PRICE_FEENDS } from './arbitrum-sepolia-feed';
import { POLYGON_CHAINLINK_PRICE_FEENDS } from './polygon-feed';

export interface ChainlinkFeed {
  pL: string; // pair left (!ETH/USD)
  pR: string; // pair left (ETH/!USD)
  address: string; // 0x...
  decimals: number;
}

export const PRICE_FEENDS_BY_CHAIN: Record<SupportedChainId, ChainlinkFeed[]> = {
  [SupportedChainId.POLYGON]: POLYGON_CHAINLINK_PRICE_FEENDS,
  [SupportedChainId.ARBITRUM_SEPOLIA]: ARBIRTRUM_SEPOLIA_PRICE_FEENDS,
};
