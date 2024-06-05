import { configureStore } from '@reduxjs/toolkit';

import walletReducer from 'entities/wallet/model/store';

import { fetchUniswapTokenList } from 'features/tokens/model/hooks/useGetTokens';
import tokensReducer from 'features/tokens/model/store';
import listsReducer from 'features/tokens/model/store/lists';

export const store = configureStore({
  reducer: {
    wallet: walletReducer,
    lists: listsReducer,
    tokens: tokensReducer,
    [fetchUniswapTokenList.reducerPath]: fetchUniswapTokenList.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(fetchUniswapTokenList.middleware),
});
export type AppDispatch = typeof store.dispatch;
export type GetState = typeof store.getState;
export type RootState = ReturnType<GetState>;
