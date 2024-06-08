import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { SupportedChainId } from 'entities/wallet/model/types/chain';

import { getUniqueListChainsBy, sortTokensByBalanceWei } from '../helper';

export interface ITokenList {
  name: string;
  symbol: string;
  logo: string;
  decimals: number;
  address: string;
  chainId: SupportedChainId;
}
export interface ITokenPrice {
  [symbol: string]: string; // token address: priceUSD
}

export interface IToken extends ITokenList {
  balanceWei: string; // user balance amount
  priceUSD?: string; // price from feeds
}

export interface TokensState {
  tokens?: IToken[];
  list?: ITokenList[];
  prices?: ITokenPrice;
}

const initialState: TokensState = {};

export const tokensSlice = createSlice({
  name: 'tokens',
  initialState,
  reducers: {
    addTokensToList: (state, action: PayloadAction<ITokenList[]>) => {
      const oldList = state.list || [];
      state.list = getUniqueListChainsBy([...oldList, ...action.payload], 'symbol');
    },
    updateTokenList: (state, action: PayloadAction<ITokenList[]>) => {
      state.list = action.payload;
    },
    updateTokens: (state, action: PayloadAction<IToken[]>) => {
      const tokens = action.payload;
      state.tokens = tokens.sort(sortTokensByBalanceWei);
    },
    addTokensPrices: (state, action: PayloadAction<ITokenPrice[]>) => {
      state.prices = action.payload.reduce((acc, item) => {
        acc[item.symbol] = item.priceUSD;
        return acc;
      }, {} as ITokenPrice);
    },
  },
});

export const { updateTokens, updateTokenList, addTokensToList, addTokensPrices } = tokensSlice.actions;

export default tokensSlice.reducer;
