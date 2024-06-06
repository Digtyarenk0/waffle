export enum SupportedChainId {
  POLYGON = 137,
  ARBITRUM_SEPOLIA = 421614,
}

export const MAINNET_CHAIN_IDS: Record<SupportedChainId, boolean> = {
  [SupportedChainId.POLYGON]: false,
  [SupportedChainId.ARBITRUM_SEPOLIA]: false,
};

export const TESTNET_CHAIN_IDS: Record<SupportedChainId, boolean> = {
  [SupportedChainId.POLYGON]: true,
  [SupportedChainId.ARBITRUM_SEPOLIA]: true,
};
