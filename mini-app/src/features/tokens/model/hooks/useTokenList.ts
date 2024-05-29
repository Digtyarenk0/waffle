import { useEffect, useMemo } from 'react';

import { useTypedDispatch } from 'entities/store/model/useStore';
import { useWalletApp } from 'entities/wallet/model/context';

import { useFetchUniswapTokensListQuery } from 'features/tokens/model/hooks/useGetTokens';

import { getUniqueListBy } from '../helper';
import { updateTokenList } from '../store';

export const useFetchTokensLists = () => {
  const dispatch = useTypedDispatch();

  const { chainId } = useWalletApp();
  const uniTokensList = useFetchUniswapTokensListQuery(chainId).data || [];

  const tokensList = useMemo(() => {
    const tokens = [...uniTokensList].map((t) => ({
      name: t.name,
      symbol: t.symbol,
      logo: t.logoURI,
      decimals: t.decimals,
      address: t.address,
    }));
    return getUniqueListBy([...tokens], 'symbol');
  }, [uniTokensList?.length]);

  useEffect(() => {
    if (tokensList?.length) {
      dispatch(updateTokenList(tokensList));
    }
  }, [tokensList?.length]);

  return;
};
