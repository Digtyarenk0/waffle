import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Big from 'big.js';

import { SupportedChainId } from 'entities/wallet/model/types/chain';

import { getUniqueListChainsBy } from '../helper';

export interface ITokenList {
  name: string;
  symbol: string;
  logo: string;
  decimals: number;
  address: string;
  chainId: SupportedChainId;
}
export interface ITokenPrice {
  [address: string]: string; // token address: priceUSD
}

export interface IToken extends ITokenList {
  balanceWei: string; // user balance amount
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
      state.tokens = tokens.sort((a, b) => {
        const balanceA = a.balanceWei || 0;
        const balanceB = b.balanceWei || 0;
        return Big(balanceB).minus(balanceA).toNumber();
      });
    },
    addTokensPrices: (state, action: PayloadAction<ITokenPrice[]>) => {
      state.prices = action.payload.reduce((acc, item) => {
        acc[item.address] = item.priceUSD;
        return acc;
      }, {} as ITokenPrice);
    },
  },
});

export const { updateTokens, updateTokenList, addTokensToList, addTokensPrices } = tokensSlice.actions;

export default tokensSlice.reducer;
