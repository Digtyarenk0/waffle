import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

import { SEARCH_PARAMS } from 'shared/constants/serchparams';

import { useTypedSelector } from 'entities/store/model/useStore';

import { SendTokenTo } from './send-token';

export const SendToken = () => {
  const [searchParams] = useSearchParams();
  const tokens = useTypedSelector((s) => s.tokens.tokens || []);
  const prices = useTypedSelector((s) => s.tokens.prices);

  const paramSendToken = useMemo(() => searchParams.get(SEARCH_PARAMS.send_token), [searchParams]);
  const sendToken = useMemo(() => {
    const token = tokens.find((t) => t.address === paramSendToken);
    if (!token) return;
    return { ...token, priceUSD: prices?.[token.symbol] };
  }, [tokens, prices, paramSendToken]);

  if (!sendToken)
    return (
      <div className="flex justify-center items-center p-10 h-[70vh] w-full">
        <div className="bg-gray-light/50 animate-pulse h-full w-full rounded-3xl"></div>
      </div>
    );
  return <SendTokenTo token={sendToken} />;
};
