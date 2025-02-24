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
  reducerPath: 'fetchUniswapTokensList',
  baseQuery: fetchBaseQuery({ baseUrl: UNISWAP_TOKENS_LIST_URL }),
  endpoints: (builder) => ({
    fetchUniswapTokensList: builder.query<UniIpfsToken[], number>({
      query: (_) => ({
        url: '',
      }),
      transformResponse: (response: UniTokensListResponse) => {
        return response.tokens.filter((t) => t.symbol !== CHAIN_INFO[t.chainId]?.nativeCurrency?.symbol);
      },
    }),
  }),
});

export const { useFetchUniswapTokensListQuery } = fetchUniswapTokenList;
