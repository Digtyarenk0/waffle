import Big from 'big.js';

import { weiToAmount } from 'shared/utils/amount';

import { SupportedChainId } from 'entities/wallet/model/types/chain';

import { IToken, ITokenList } from '../store';

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

export const sortTokensByBalanceWei = (a: IToken, b: IToken) => {
  const balanceA = a.balanceWei || 0;
  const balanceB = b.balanceWei || 0;
  return Big(balanceB).minus(balanceA).toNumber();
};

export const sortTokensByBalancePrice = (a: IToken, b: IToken) => {
  const balanceA = weiToAmount(a.balanceWei || 0, a.decimals || 18);
  const sumA = Big(a?.priceUSD || 0).mul(balanceA);
  const balanceB = weiToAmount(b.balanceWei || 0, b.decimals || 18);
  const sumB = Big(b.priceUSD || 0).mul(balanceB);
  return Big(sumB).minus(sumA).toNumber();
};
