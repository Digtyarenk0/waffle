import { JsonRpcProvider } from '@ethersproject/providers';
import { Wallet } from '@ethersproject/wallet';
import { ethers } from 'ethers';
import React, { FC, useContext, useMemo } from 'react';

import { RPC_PROVIDERS } from 'shared/constants/rpc';

import { SupportedChainId } from '../types/chain';

interface WalletContext {
  wallet: Wallet;
  provider: JsonRpcProvider;
  account: string;
  chainId: SupportedChainId;
}

const WalletAppContext = React.createContext(undefined as unknown as WalletContext);

export const WalletAppContextProvider: FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  // const cloud = useCloudStorage();

  // const backUPWallet = useCallback(async () => {
  //   const walletbackup = await cloud.getItem(walletKeyCloud);
  //   if (walletbackup) {
  //     const walletInit = new ethers.Wallet(
  //       walletbackup,
  //       RPC_PROVIDERS[chain],
  //     );
  //     dispatch(addWallet(walletInit as unknown as ethers.Wallet));
  //   } else {
  //     const walletInit = Wallet.createRandom(RPC_PROVIDERS[chain]);
  //     await cloud.setItem(walletKeyCloud, walletInit.privateKey);
  //     dispatch(addWallet(walletInit as unknown as ethers.Wallet));
  //   }
  // }, [cloud]);

  const value: WalletContext = useMemo(() => {
    //
    const chainId = SupportedChainId.AMOY;
    const pk = process.env.PK_LOCAL as string;
    //

    const provider = RPC_PROVIDERS[chainId];
    const wallet = new ethers.Wallet(pk).connect(provider);
    return {
      wallet: wallet,
      provider,
      account: wallet.address,
      chainId,
    };
  }, []);

  return <WalletAppContext.Provider value={value}>{children}</WalletAppContext.Provider>;
};

export const useWalletApp = () => {
  const context = useContext(WalletAppContext);
  if (!context) {
    throw new Error('useWalletApp must be used within a ParaswapDataContext');
  }

  return context;
};
