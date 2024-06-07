import { SupportedChainId } from 'entities/wallet/model/types/chain';

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
export const DEAD_ADDRESS = '0x000000000000000000000000000000000000dEaD';
export const MOCK_ADDRESS = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';

export const UNISWAP_MULTICALL_ADDRESSES: Record<SupportedChainId, string> & Record<number, string> = {
  [SupportedChainId.POLYGON]: '0x1F98415757620B543A52E61c46B32eB19261F984',
  [SupportedChainId.ARBITRUM_SEPOLIA]: '0xbdE74543fBc6666Be72cbba398765C7d8BE578ad',
};
