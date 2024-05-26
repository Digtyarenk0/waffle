import { configureStore } from '@reduxjs/toolkit';

import wallet from 'entities/wallet/model/store';

export const store = configureStore({
  reducer: {
    wallet,
  },
});
export type AppDispatch = typeof store.dispatch;
export type GetState = typeof store.getState;
export type RootState = ReturnType<GetState>;
