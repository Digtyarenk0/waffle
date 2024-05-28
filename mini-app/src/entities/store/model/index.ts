import { configureStore } from '@reduxjs/toolkit';

import { fetchUniswapTokenList } from 'features/tokens/model/hooks/useGetTokens';

export const store = configureStore({
  reducer: {
    [fetchUniswapTokenList.reducerPath]: fetchUniswapTokenList.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(fetchUniswapTokenList.middleware),
});
export type AppDispatch = typeof store.dispatch;
export type GetState = typeof store.getState;
export type RootState = ReturnType<GetState>;
