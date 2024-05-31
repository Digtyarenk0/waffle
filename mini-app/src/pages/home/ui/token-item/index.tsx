import { memo, useMemo } from 'react';

import { weiToAmount } from 'shared/utils/amount';

import { IToken } from 'features/tokens/model/store';

export const HomeTokenItem = memo((t: IToken) => {
  const balance = useMemo(() => {
    if (t.balanceWei === '0') return '0';
    return weiToAmount(t.balanceWei || 0, t.decimals || 18).toFixed(7);
  }, [t.balanceWei]);

  return (
    <div className="flex items-center">
      <img className="w-7 h-7 m-1 mr-3" src={t.logo} alt="" />
      <div>
        <p>{t.name}</p>
        <p>{`${balance} ${t.symbol}`}</p>
      </div>
    </div>
  );
});
