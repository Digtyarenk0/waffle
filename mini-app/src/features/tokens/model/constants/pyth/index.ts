import { SupportedChainId } from 'entities/wallet/model/types/chain';

// https://docs.pyth.network/price-feeds/contract-addresses/evm
export const PYTH_CONTRACT_ADDRESS_BY_CHAIN: Record<SupportedChainId, string> = {
  [SupportedChainId.POLYGON]: '0xff1a0f4744e8582DF1aE09D5611b887B6a12925C',
  [SupportedChainId.ARBITRUM_SEPOLIA]: '0x4374e5a8b9C22271E9EB878A2AA31DE97DF15DAF',
};
