import { ethers } from 'ethers';
import { useState, useEffect } from 'react';

import { weiToAmount } from 'shared/utils/amount';

export const useNativBalance = (provider?: ethers.Provider, address?: string) => {
  const [balance, setBalance] = useState<string>('-');

  useEffect(() => {
    if (provider && address) {
      provider?.getBalance(address).then((i) => setBalance(weiToAmount(i.toString(), 18).toString()));
    }
  }, [provider]);

  return balance;
};
