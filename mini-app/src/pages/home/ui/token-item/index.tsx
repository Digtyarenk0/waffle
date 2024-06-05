import Big from 'big.js';
import { memo, useMemo } from 'react';

import { weiToAmount } from 'shared/utils/amount';

import { IToken } from 'features/tokens/model/store';

interface HomeTokenItem extends IToken {
  priceUSD?: string;
}

export const HomeTokenItem = memo((token: HomeTokenItem) => {
  const balance = useMemo(() => {
    if (token.balanceWei === '0') return '0';
    return weiToAmount(token.balanceWei || 0, token.decimals || 18).toFixed(4);
  }, [token.balanceWei]);

  const price = useMemo(() => {
    if (!token.priceUSD) return;
    return {
      cost: Big(token.priceUSD).toFixed(2),
      sum: balance !== '0' && Big(token.priceUSD).mul(balance).toFixed(2),
    };
  }, [token.priceUSD, balance]);

  return (
    <div className="flex items-center w-full">
      <img className="w-7 h-7 m-1 mr-3" src={token.logo} alt="" />
      <div className="flex justify-between w-full">
        <div>
          <p>{token.symbol}</p>
          <p className="text-gray-main">{price?.cost ? `${price?.cost} $` : '~'}</p>
        </div>
        <div className="text-right">
          <p>{`${balance}`}</p>
          <p className="text-gray-main">{price?.sum ? `${price?.sum} $` : '~'}</p>
        </div>
      </div>
    </div>
  );
});
