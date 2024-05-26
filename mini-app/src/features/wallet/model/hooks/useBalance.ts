import { ethers } from 'ethers';
import { useState, useEffect } from 'react';

import { weiToAmount } from 'shared/utils/amount';

export const useNativBalance = (wallet?: ethers.Wallet) => {
  const [balance, setBalance] = useState<string>('-');

  useEffect(() => {
    if (wallet) {
      wallet.provider?.getBalance(wallet.address).then((i) => setBalance(weiToAmount(i.toString(), 18).toString()));
    }
  }, [wallet]);

  return balance;
};
