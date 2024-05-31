import { useState, useEffect } from 'react';

import { weiToAmount } from 'shared/utils/amount';

import { useWalletApp } from '../context';

export const useNativBalance = (provider?: any, address?: string) => {
  const wallet = useWalletApp().wallet;
  const [balance, setBalance] = useState<string>('0');

  useEffect(() => {
    if (wallet.address) {
      wallet.getBalance(address).then((i) => setBalance(weiToAmount(i.toString(), 18).toString()));
    }
  }, [wallet.address]);

  return balance;
};
