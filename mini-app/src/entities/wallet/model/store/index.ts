import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ethers } from 'ethers';

import { WalletStore } from './types';

const initialState: WalletStore = {};

export const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    addWallet: (state, action: PayloadAction<ethers.Wallet>) => {
      state.provider = action.payload.provider as ethers.Provider;
      state.address = action.payload.address;
      state.wallet = action.payload;
    },
    updateBalance: (state, action: PayloadAction<string>) => {
      state.balance = action.payload;
    },
  },
});

export const { addWallet, updateBalance } = walletSlice.actions;

export default walletSlice.reducer;
