import { Wallet } from '@ethersproject/wallet';
import { ethers } from 'ethers';
import React, { FC, useContext, useMemo } from 'react';
interface WalletContext {
  wallet: Wallet;
  account: string;
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
    const pk = process.env.REACT_APP_PK_LOCAL as string;
    //
    const wallet = new ethers.Wallet(pk);
    // toast.info(`Network ${CHAIN_INFO[chainId].label}`);
    return {
      wallet: wallet,
      account: wallet.address,
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
