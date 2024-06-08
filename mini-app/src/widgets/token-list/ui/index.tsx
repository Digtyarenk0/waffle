import { useMemo } from 'react';

import { HomeTokenItem } from 'shared/ui/token-item';

import { useTypedSelector } from 'entities/store/model/useStore';

import { sortTokensByBalancePrice } from 'features/tokens/model/helper';

export const TokenList = () => {
  const prices = useTypedSelector((s) => s.tokens.prices);
  const tokens = useTypedSelector((s) => s.tokens.tokens);

  const sorted = useMemo(() => {
    return tokens
      ?.map((t) => {
        const priceUSD = t?.priceUSD || prices?.[t.address];
        return { ...t, priceUSD };
      })
      .sort(sortTokensByBalancePrice);
  }, [tokens, prices]);

  return <div>{sorted?.map((t) => <HomeTokenItem {...t} key={t.address} />)}</div>;
};
