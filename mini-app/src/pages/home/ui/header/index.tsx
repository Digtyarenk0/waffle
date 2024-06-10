import { useHapticFeedback } from '@vkruglikov/react-telegram-web-app';
import Big from 'big.js';
import { useCallback, useMemo } from 'react';

import { ICONS_UI } from 'shared/constants/icons';
import { useClipboard } from 'shared/hooks/useClipboard';
import useDebounce from 'shared/hooks/useDebounce';
import { weiToAmount } from 'shared/utils/amount';

import { useTypedSelector } from 'entities/store/model/useStore';
import { useWalletApp } from 'entities/wallet/model/context';

const debounce = 700;

export const HomeHeader = () => {
  const [impactOccurred] = useHapticFeedback();

  const tokens = useTypedSelector((s) => s.tokens.tokens);
  const prices = useTypedSelector((s) => s.tokens.prices);
  const tokensDeb = useDebounce(tokens, debounce).value;
  const pricesDeb = useDebounce(prices, debounce).value;

  const { account } = useWalletApp();

  const clipboard = useClipboard(account);
  const balance = useMemo(() => {
    const balances: Big[] = [];
    tokensDeb?.forEach((t) => {
      if (!pricesDeb?.[t.symbol]) return;
      const balance = weiToAmount(t.balanceWei || 0, t.decimals || 18);
      const price = pricesDeb[t.symbol] as string;
      if (balance.gt(0)) balances.push(Big(price).mul(balance));
    });

    return balances.reduce((b, s) => b.add(s), Big(0)).toFixed(2);
  }, [tokensDeb, pricesDeb]);

  const copy = useCallback(() => {
    impactOccurred('heavy');
    clipboard.copy();
  }, [clipboard, impactOccurred]);

  const scan = useCallback(() => {
    impactOccurred('heavy');
  }, [impactOccurred]);

  const isLoad = !tokensDeb || !pricesDeb;

  return (
    <div className="flex justify-between items-center relative h-24 px-8">
      <img src={ICONS_UI.waffle} alt="" className="absolute -left-0 w-[116px]" />
      <p className="text-2xl text-white-main flex justify-center items-center font-bold ">
        $&nbsp;{isLoad ? <div className="bg-gray-main animate-pulse rounded-lg w-12 h-6" /> : balance}
      </p>
      <div className="flex flex-col">
        <button onClick={scan}>
          <img src={ICONS_UI.scan} alt="" className="w-5 mb-4" />
        </button>
        <button onClick={copy}>
          <img src={ICONS_UI.copy} alt="" className="w-5" />
        </button>
      </div>
    </div>
  );
};
