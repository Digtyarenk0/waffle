import Big from 'big.js';
import { memo, useMemo } from 'react';

import { ICONS_CHAINS, ICONS_TOKEN } from 'shared/constants/icons';
import { weiToAmount } from 'shared/utils/amount';

import { IToken } from 'features/tokens/model/store';

interface TokenListItem {
  token: IToken;
  onClick?: () => void;
}

export const TokenListItem = memo((props: TokenListItem) => {
  const { token, onClick } = props;

  const balance = useMemo(
    () => (token.balanceWei !== '0' ? weiToAmount(token.balanceWei || 0, token.decimals || 18).toFixed(4) : '0'),
    [token.balanceWei, token.decimals],
  );

  const price = useMemo(() => {
    if (!token.priceUSD) return;
    return {
      cost: Big(token.priceUSD).toFixed(2),
      sum: balance !== '0' && Big(token.priceUSD).mul(balance).toFixed(2),
    };
  }, [token.priceUSD, balance]);

  return (
    <button className="flex items-center w-full my-2" onClick={onClick}>
      <div className="relative">
        <img loading="lazy" className="w-8 h-8 m-1 mr-3" src={token.logo || ICONS_TOKEN.mock} alt="" />
        <img loading="lazy" src={ICONS_CHAINS[token.chainId]} alt="" className="absolute bottom-0 right-1 w-4 h-4" />
      </div>
      <div className="flex justify-between w-full">
        <div className="text-start flex flex-col justify-center">
          <p className="text-black-theme font-boldsf text-sm">{token.symbol}</p>
          <p className="text-gray-main text-sm">{price?.cost ? `${price?.cost}` : '~'}</p>
        </div>
        <div className="text-right">
          <p className="text-black-theme font-boldsf text-sm">{`${balance}`}</p>
          <p className="text-gray-main">{price?.sum ? `$ ${price?.sum}` : '~'}</p>
        </div>
      </div>
    </button>
  );
});
