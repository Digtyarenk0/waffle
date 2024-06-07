import { useState, useEffect } from 'react';

import { CHAIN_INFO } from 'shared/constants/chain';
import { weiToAmount } from 'shared/utils/amount';

import { useWalletApp } from '../context';
import { SupportedChainId } from '../types/chain';

export const useNativeBalance = (chainId: SupportedChainId, address?: string) => {
  const { wallet } = useWalletApp();
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
