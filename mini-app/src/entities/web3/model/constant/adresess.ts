import { SupportedChainId } from 'entities/wallet/model/types/chain';

export const UNISWAP_MULTICALL_ADDRESSES: Record<SupportedChainId, string> & Record<number, string> = {
  [SupportedChainId.AMOY]: '0x1F98415757620B543A52E61c46B32eB19261F984',
};
