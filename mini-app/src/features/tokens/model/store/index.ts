import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Big from 'big.js';

import { getUniqueListBy } from '../helper';

export interface ITokenList {
  name: string;
  symbol: string;
  logo: string;
  decimals: number;
  address: string;
}

export interface IToken extends ITokenList {
  balanceWei: string; // user balance amount
}

export interface TokensState {
  list?: ITokenList[];
  tokens?: IToken[];
}

const initialState: TokensState = {};

export const tokensSlice = createSlice({
  name: 'tokens',
  initialState,
  reducers: {
    addTokensToList: (state, action: PayloadAction<ITokenList[]>) => {
      const oldList = state.list || [];
      state.list = getUniqueListBy([...oldList, ...action.payload], 'symbol');
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
  },
});

export const { updateTokens, updateTokenList, addTokensToList } = tokensSlice.actions;

export default tokensSlice.reducer;
