import { getVersionUpgrade, VersionUpgrade } from '@uniswap/token-lists';
import ms from 'ms';
import { useCallback, useEffect, useMemo } from 'react';

import useDebounce from 'shared/hooks/useDebounce';
import useInterval from 'shared/hooks/useInterval';
import { useIsWindowVisible } from 'shared/hooks/useIsWindowVisible';

import { useTypedDispatch, useTypedSelector } from 'entities/store/model/useStore';
import { useWalletApp } from 'entities/wallet/model/context';

import { DEFAULT_LIST_OF_LISTS, UNSUPPORTED_LIST_URLS } from 'features/tokens/model/constants';
import { useAllLists } from 'features/tokens/model/helper/list-helper';
import { useFetchListCallback } from 'features/tokens/model/hooks/useFetchListCallback';
import { addTokensToList, ITokenList } from 'features/tokens/model/store';
import { acceptListUpdate } from 'features/tokens/model/store/lists';

import TokenSafetyLookupTable from '../../model/helper/token-safety-lookup';

export const ListsUpdater = (): null => {
  const dispatch = useTypedDispatch();
  const { provider, chainId } = useWalletApp();

  const isWindowVisible = useIsWindowVisible();

  // get all loaded lists, and the active urls
  const lists = useAllLists();
  const urls = useTypedSelector((state) => state.lists.lastInitializedDefaultListOfLists);
  const listsState = useTypedSelector((state) => state.lists);
  const listDebounce = useDebounce(listsState, 200).value;

  useEffect(() => {
    TokenSafetyLookupTable.update(listsState);
  }, [listsState]);

  const tokens = useMemo(() => {
    const tokensByUrls =
      urls
        ?.map((i) => {
          const tokensUrlData = listDebounce.byUrl[i].current?.tokens;
          const currentChainTokens = tokensUrlData
            ?.filter((t) => t.chainId === chainId)
            .map((t) => ({
              name: t.name,
              symbol: t.symbol,
              logo: t.logoURI || '',
              decimals: t.decimals,
              address: t.address,
            }));
          return currentChainTokens;
        })
        .filter((i) => !!i) || [];
    return tokensByUrls.flat() as ITokenList[];
  }, [listDebounce, chainId]);
  const tokensDebounce = useDebounce(tokens, 200).value;

  const fetchList = useFetchListCallback();
  const fetchAllListsCallback = useCallback(() => {
    if (!isWindowVisible) return;
    DEFAULT_LIST_OF_LISTS.forEach((url) => {
      // Skip validation on unsupported lists
      const isUnsupportedList = UNSUPPORTED_LIST_URLS.includes(url);
      fetchList(url, isUnsupportedList);
    });
  }, [fetchList, isWindowVisible]);

  // fetch all lists every 10 minutes, but only after we initialize provider
  useInterval(fetchAllListsCallback, provider ? ms('10m') : null);

  useEffect(() => {
    // whenever a list is not loaded and not loading, try again to load it
    Object.keys(lists).forEach((listUrl) => {
      const list = lists[listUrl];
      if (!list.current && !list.loadingRequestId && !list.error) {
        fetchList(listUrl);
      }
    });
    UNSUPPORTED_LIST_URLS.forEach((listUrl) => {
      const list = lists[listUrl];
      if (!list || (!list.current && !list.loadingRequestId && !list.error)) {
        fetchList(listUrl, /* isUnsupportedList= */ true);
      }
    });
  }, [dispatch, fetchList, lists]);

  // automatically update lists for every version update
  useEffect(() => {
    Object.keys(lists).forEach((listUrl) => {
      const list = lists[listUrl];
      if (list.current && list.pendingUpdate) {
        const bump = getVersionUpgrade(list.current.version, list.pendingUpdate.version);
        switch (bump) {
          case VersionUpgrade.NONE:
            throw new Error('unexpected no version bump');
          case VersionUpgrade.PATCH:
          case VersionUpgrade.MINOR:
          case VersionUpgrade.MAJOR:
            dispatch(acceptListUpdate(listUrl));
        }
      }
    });
  }, [dispatch, lists]);

  useEffect(() => {
    if (tokensDebounce) {
      console.log('Tokens from all', tokensDebounce.length);
      dispatch(addTokensToList(tokensDebounce.slice(0, 200)));
    }
  }, [tokensDebounce]);

  return null;
};
