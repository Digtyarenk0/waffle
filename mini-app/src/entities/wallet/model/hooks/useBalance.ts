import { useState, useEffect } from 'react';

import { CHAIN_INFO } from 'shared/constants/chain';
import { weiToAmount } from 'shared/utils/amount';

import { useWalletApp } from '../context';

export const useNativeBalance = (provider?: any, address?: string) => {
  const { wallet, chainId } = useWalletApp();
  const [balance, setBalance] = useState<string>('0');

  useEffect(() => {
    if (wallet.address) {
      wallet
        .getBalance(address)
        .then((i) => setBalance(weiToAmount(i.toString(), CHAIN_INFO[chainId].nativeCurrency.decimals).toString()));
    }
  }, [wallet.address]);

  return balance;
};
