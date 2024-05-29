import { nanoid } from '@reduxjs/toolkit';
import { useCallback } from 'react';

import { RPC_PROVIDERS } from 'shared/constants/rpc';

import { useTypedDispatch } from 'entities/store/model/useStore';
import { SupportedChainId } from 'entities/wallet/model/types/chain';

import { fetchTokenList } from '../helper/fetch-token-list';
import { resolveENSContentHash } from '../helper/resolveENSContentHash';
import { fetchTokenListPending, fetchTokenListFulfilled, fetchTokenListRejected } from '../store/lists';

export const useFetchListCallback = (): ((listUrl: string, skipValidation?: boolean) => void) => {
  const dispatch = useTypedDispatch();

  return useCallback(
    async (listUrl: string) => {
      const requestId = nanoid();
      dispatch(fetchTokenListPending({ requestId, url: listUrl }));
      try {
        const tokenList = await fetchTokenList(listUrl, (ensName: string) =>
          resolveENSContentHash(ensName, RPC_PROVIDERS[SupportedChainId.AMOY]),
        );
        dispatch(fetchTokenListFulfilled({ url: listUrl, tokenList, requestId }));
      } catch (error: any) {
        dispatch(fetchTokenListRejected({ url: listUrl, requestId, errorMessage: error?.message }));
      }
    },
    [dispatch, RPC_PROVIDERS],
  );
};
