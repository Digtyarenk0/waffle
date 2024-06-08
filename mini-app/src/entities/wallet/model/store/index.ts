import { createSlice } from '@reduxjs/toolkit';

export interface WalletState {
  transactionsCount: number;
}

const initialState: WalletState = {
  transactionsCount: 0,
};

export const walletStateSlice = createSlice({
  name: 'walletState',
  initialState,
  reducers: {
    incTxCount: (state) => {
      state.transactionsCount++;
    },
  },
});

export const { incTxCount } = walletStateSlice.actions;

export default walletStateSlice.reducer;
