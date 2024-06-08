import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

import { routes } from 'shared/constants/routes';
import { Loader } from 'shared/ui/loader';

import { useTypedSelector } from 'entities/store/model/useStore';

import { SendTokenTo } from './send-token';

export const SendToken = () => {
  const [searchParams] = useSearchParams();
  const tokens = useTypedSelector((s) => s.tokens.tokens || []);
  const prices = useTypedSelector((s) => s.tokens.prices);

  const paramSendToken = useMemo(() => searchParams.get(routes.send_token), [searchParams]);
  const sendToken = useMemo(() => {
    const token = tokens.find((t) => t.address === paramSendToken);
    if (!token) return;
    return { ...token, priceUSD: prices?.[token.symbol] };
  }, [tokens, prices, paramSendToken]);

  if (!sendToken) return <Loader />;
  return <SendTokenTo token={sendToken} />;
};
