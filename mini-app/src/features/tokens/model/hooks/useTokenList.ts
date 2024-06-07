import { useEffect, useMemo } from 'react';

import { useTypedDispatch } from 'entities/store/model/useStore';
import { useWalletApp } from 'entities/wallet/model/context';
import { SupportedChainId } from 'entities/wallet/model/types/chain';

import { useFetchUniswapTokensListQuery } from 'features/tokens/model/hooks/useGetTokens';

import { getUniqueListChainsBy } from '../helper';
import { TESTNENT_TOKENS_LIST } from '../helper/testnet-list';
import { updateTokenList } from '../store';

export const useFetchTokensLists = () => {
  const dispatch = useTypedDispatch();

  const { chainId } = useWalletApp();
  const uniTokensList = useFetchUniswapTokensListQuery(chainId).data || [];

  const tokensList = useMemo(() => {
    const tokens = [...uniTokensList, ...Object.values(TESTNENT_TOKENS_LIST[SupportedChainId.ARBITRUM_SEPOLIA])].map(
      (t) => ({
        name: t.name,
        symbol: t.symbol,
        logo: t.logoURI,
        decimals: t.decimals,
        address: t.address,
        chainId: t.chainId,
      }),
    );
    return getUniqueListChainsBy(tokens, 'symbol');
  }, [uniTokensList?.length, chainId]);

  useEffect(() => {
    if (tokensList?.length) {
      dispatch(updateTokenList(tokensList));
    }
  }, [tokensList?.length]);

  return;
};
