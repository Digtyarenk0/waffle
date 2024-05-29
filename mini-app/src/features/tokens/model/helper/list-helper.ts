import { TokenList } from '@uniswap/token-lists';
import { useMemo } from 'react';

import { useTypedSelector } from 'entities/store/model/useStore';

import { TokenFromList } from 'features/tokens/types/token-from-list';

import { DEFAULT_ACTIVE_LIST_URLS } from '../constants';

export function useAllLists() {
  return useTypedSelector((state) => state.lists.byUrl);
}

type TokenMap = Readonly<{ [tokenAddress: string]: { token: TokenFromList; list?: TokenList } }>;
export type TokenAddressMap = Readonly<{ [chainId: number]: TokenMap }>;

type Mutable<T> = {
  -readonly [P in keyof T]: Mutable<T[P]>;
};

const mapCache = typeof WeakMap !== 'undefined' ? new WeakMap<TokenList, TokenAddressMap>() : null;

/**
 * Combine the tokens in map2 with the tokens on map1, where tokens on map1 take precedence
 * @param map1 the base token map
 * @param map2 the map of additioanl tokens to add to the base map
 */
function combineMaps(map1: TokenAddressMap, map2: TokenAddressMap): TokenAddressMap {
  const chainIds = Object.keys(
    Object.keys(map1)
      .concat(Object.keys(map2))
      .reduce<{ [chainId: string]: true }>((memo, value) => {
        memo[value] = true;
        return memo;
      }, {}),
  ).map((id) => parseInt(id));

  return chainIds.reduce<Mutable<TokenAddressMap>>((memo, chainId) => {
    memo[chainId] = {
      ...map2[chainId],
      // map1 takes precedence
      ...map1[chainId],
    };
    return memo;
  }, {}) as TokenAddressMap;
}

export function tokensToChainTokenMap(tokens: TokenList): TokenAddressMap {
  const cached = mapCache?.get(tokens);
  if (cached) return cached;

  const [list, infos] = Array.isArray(tokens) ? [undefined, tokens] : [tokens, tokens.tokens];
  // @ts-ignore
  const map = infos.reduce<Mutable<TokenAddressMap>>((map, info) => {
    try {
      const token = new TokenFromList(info, list);
      if (map[token.chainId]?.[token.address] !== undefined) {
        console.warn(`Duplicate token skipped: ${token.address}`);
        return map;
      }
      if (!map[token.chainId]) {
        map[token.chainId] = {};
      }
      map[token.chainId][token.address] = { token, list };
      return map;
    } catch {
      return map;
    }
  }, {}) as TokenAddressMap;
  mapCache?.set(tokens, map);
  return map;
}

// merge tokens contained within lists from urls
export function useCombinedTokenMapFromUrls(urls: string[] | undefined): TokenAddressMap {
  const lists = useAllLists();
  return useMemo(() => {
    if (!urls) return {};
    return urls.slice().reduce((allTokens, currentUrl) => {
      const current = lists[currentUrl]?.current;
      if (!current) return allTokens;
      try {
        return combineMaps(allTokens, tokensToChainTokenMap(current));
      } catch (error) {
        console.error('Could not show token list due to error', error);
        return allTokens;
      }
    }, {});
  }, [lists, urls]);
}

// get all the tokens from active lists, combine with local default tokens
export function useCombinedActiveList(): TokenAddressMap {
  const activeTokens = useCombinedTokenMapFromUrls(DEFAULT_ACTIVE_LIST_URLS);
  return activeTokens;
}
