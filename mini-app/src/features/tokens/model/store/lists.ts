import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getVersionUpgrade, TokenList, VersionUpgrade } from '@uniswap/token-lists';

import { DEFAULT_LIST_OF_LISTS } from '../constants';

export interface ListsState {
  readonly byUrl: {
    readonly [url: string]: {
      readonly current: TokenList | null;
      readonly pendingUpdate: TokenList | null;
      readonly loadingRequestId: string | null;
      readonly error: string | null;
    };
  };
  readonly lastInitializedDefaultListOfLists?: string[];
}

const NEW_LIST_STATE = {
  error: null,
  current: null,
  loadingRequestId: null,
  pendingUpdate: null,
};

const initialState: ListsState = {
  lastInitializedDefaultListOfLists: DEFAULT_LIST_OF_LISTS,
  byUrl: DEFAULT_LIST_OF_LISTS.reduce(
    (memo, listUrl) => {
      memo[listUrl] = NEW_LIST_STATE;
      return memo;
    },
    {} as { [url: string]: typeof NEW_LIST_STATE },
  ),
};

const listsSlice = createSlice({
  name: 'lists',
  initialState,
  reducers: {
    fetchTokenListPending(state, action: PayloadAction<{ url: string; requestId: string }>) {
      const { requestId, url } = action.payload;
      const current = state.byUrl[url]?.current ?? null;
      const pendingUpdate = state.byUrl[url]?.pendingUpdate ?? null;

      state.byUrl[url] = {
        current,
        pendingUpdate,
        loadingRequestId: requestId,
        error: null,
      };
    },
    fetchTokenListFulfilled(state, action: PayloadAction<{ url: string; tokenList: TokenList; requestId: string }>) {
      const { requestId, tokenList, url } = action.payload;
      const current = state.byUrl[url]?.current;
      const loadingRequestId = state.byUrl[url]?.loadingRequestId;

      if (current) {
        const upgradeType = getVersionUpgrade(current.version, tokenList.version);

        if (upgradeType === VersionUpgrade.NONE) return;
        if (loadingRequestId === null || loadingRequestId === requestId) {
          state.byUrl[url] = {
            current,
            pendingUpdate: tokenList,
            loadingRequestId: null,
            error: null,
          };
        }
      } else {
        state.byUrl[url] = {
          current: tokenList,
          pendingUpdate: null,
          loadingRequestId: null,
          error: null,
        };
      }
    },
    fetchTokenListRejected(state, action: PayloadAction<{ url: string; requestId: string; errorMessage: string }>) {
      const { url, requestId, errorMessage } = action.payload;

      if (state.byUrl[url]?.loadingRequestId !== requestId) {
        return;
      }

      state.byUrl[url] = {
        current: state.byUrl[url].current ? state.byUrl[url].current : null,
        pendingUpdate: null,
        loadingRequestId: null,
        error: errorMessage,
      };
    },
    acceptListUpdate(state, action: PayloadAction<string>) {
      const url = action.payload;
      if (!state.byUrl[url]?.pendingUpdate) {
        throw new Error('accept list update called without pending update');
      }
      state.byUrl[url] = {
        ...state.byUrl[url],
        current: state.byUrl[url].pendingUpdate,
        pendingUpdate: null,
      };
    },
  },
});

export const { fetchTokenListPending, fetchTokenListFulfilled, fetchTokenListRejected, acceptListUpdate } =
  listsSlice.actions;

export default listsSlice.reducer;
