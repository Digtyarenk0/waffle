import { useMemo } from 'react';

import { TokenListItem } from 'shared/ui/token-item';

import { useTypedSelector } from 'entities/store/model/useStore';

import { sortTokensByBalancePrice } from 'features/tokens/model/helper';
import { IToken } from 'features/tokens/model/store';

interface TokenListProps {
  tokens: IToken[];
  tokenOnClick?: (address: string) => void;
}

export const TokenList = (props: TokenListProps) => {
  const { tokenOnClick, tokens } = props;
  const prices = useTypedSelector((s) => s.tokens.prices);

  const sorted = useMemo(() => {
    return tokens
      ?.map((t) => {
        const priceUSD = t?.priceUSD || prices?.[t.address];
        return { ...t, priceUSD };
      })
      .sort(sortTokensByBalancePrice);
  }, [tokens, prices]);

  return (
    <div>
      {sorted?.map((t) => <TokenListItem token={t} key={t.address} onClick={() => tokenOnClick?.(t.address)} />)}
    </div>
  );
};
