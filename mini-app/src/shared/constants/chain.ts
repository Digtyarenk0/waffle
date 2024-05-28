import { SupportedChainId } from 'entities/wallet/model/types/chain';

import { RPC_URLS } from './rpc';

export interface ChainInfo {
  label: string;
  rpcUrls: string[];
  explorer?: string[];
  nativeCurrency: {
    name: string; // 'Goerli ETH',

    // symbol must be between 2 and 6 characters. This is an OKX wallet requirement.
    symbol: string; // 'gorETH',
    decimals: number; //18,
  };
}

export const CHAIN_INFO: { [chainId in SupportedChainId]: ChainInfo } & { [chainId: number]: ChainInfo } = {
  [SupportedChainId.AMOY]: {
    label: 'Amoy',
    explorer: ['https://amoy.polygonscan.com/'],
    rpcUrls: [RPC_URLS[SupportedChainId.AMOY]],
    nativeCurrency: { name: 'Matic', symbol: 'MATIC', decimals: 18 },
  },
};
