import Big from 'big.js';
import classNames from 'classnames';
import { useMemo } from 'react';

import { useClipboard } from 'shared/hooks/useClipboard';
import { weiToAmount } from 'shared/utils/amount';
import { truncateMiddle } from 'shared/utils/text';

import { useTypedSelector } from 'entities/store/model/useStore';
import { useWalletApp } from 'entities/wallet/model/context';

export const Header = () => {
  const { account } = useWalletApp();
  const tokensWithBalance = useTypedSelector((s) => s.tokens.tokens);
  const prices = useTypedSelector((s) => s.tokens.prices);

  const address = useMemo(() => account || '...', [account]);
  const clipboard = useClipboard(address);
  const balance = useMemo(() => {
    const balances: Big[] = [];

    tokensWithBalance?.forEach((t) => {
      if (!prices?.[t.symbol]) return;
      const balance = weiToAmount(t.balanceWei || 0, t.decimals || 18);
      const price = prices[t.symbol] as string;
      if (balance.gt(0)) balances.push(Big(price).mul(balance));
    });

    return balances.reduce((b, s) => b.add(s), Big(0)).toFixed(2);
  }, [tokensWithBalance, prices]);

  return (
    <div className="pt-4 ml-5 grid grid-cols-2 grid-rows-1">
      <div className="text-start">
        <p className="text-sm">Balance:</p>
        <p className="text-base">{`${Number(balance).toFixed(4).toString()} $`}</p>
      </div>
      <button className="text-start hover:text-green-main" onClick={clipboard.copy}>
        <p className="text-sm ">Wallet:</p>
        <p className={classNames('text-base', clipboard.isCopied && 'text-green-main')}>
          {clipboard.isCopied ? 'Copied' : truncateMiddle(address, 8, 5)}
        </p>
      </button>
    </div>
  );
};
