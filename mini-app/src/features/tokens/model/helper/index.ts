import { SupportedChainId } from 'entities/wallet/model/types/chain';

import { ITokenList } from '../store';

export const getUniqueListBy = <T extends ITokenList, K extends keyof ITokenList>(arr: T[], key: K): T[] => {
  const seen = new Set();
  return arr.filter((item) => {
    const keyValue = item[key];
    if (seen.has(keyValue)) {
      return false;
    }
    seen.add(keyValue);
    return true;
  });
};

type GroupedTokens<T> = Record<SupportedChainId, T[]>;
export const getUniqueListChainsBy = <T extends ITokenList, K extends keyof ITokenList>(arr: T[], key: K): T[] => {
  const groupedTokens: GroupedTokens<T> = {} as GroupedTokens<T>;

  arr.forEach((token) => {
    if (groupedTokens[token.chainId]) {
      groupedTokens[token.chainId].push(token);
    } else {
      groupedTokens[token.chainId] = [token];
    }
  });

  const tokens = Object.keys(groupedTokens)
    .map((chain) => getUniqueListBy(groupedTokens[chain as unknown as SupportedChainId], key))
    .flat();

  return tokens;
};
