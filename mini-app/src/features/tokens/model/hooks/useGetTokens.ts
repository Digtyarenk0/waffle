import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { CHAIN_INFO } from 'shared/constants/chain';

import { UNISWAP_TOKENS_LIST_URL } from '../constants';

export interface UniIpfsToken {
  chainId: number;
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  logoURI: string;
  extensions: {
    bridgeInfo: Record<number, { tokenAddress: string }>;
  };
}

interface UniTokensListResponse {
  name: string;
  timestamp: string;
  version: {
    major: number;
    minor: number;
    patch: number;
  };
  tags: Record<any, any>;
  logoURI: string;
  keywords: string[];
  tokens: UniIpfsToken[];
}

export const fetchUniswapTokenList = createApi({
  reducerPath: 'fetchUniswapTokenList',
  baseQuery: fetchBaseQuery({ baseUrl: UNISWAP_TOKENS_LIST_URL }),
  endpoints: (builder) => ({
    fetchTokensList: builder.query<UniIpfsToken[], number>({
      query: () => ({
        url: '',
      }),
      transformResponse: (response: UniTokensListResponse, _, chainId) => {
        return response.tokens.filter(
          (t) => t.chainId === chainId && t.symbol !== CHAIN_INFO[chainId]?.nativeCurrency?.symbol,
        );
      },
    }),
  }),
});
export const { useFetchTokensListQuery } = fetchUniswapTokenList;
