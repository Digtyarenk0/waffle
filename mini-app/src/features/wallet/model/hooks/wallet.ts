import { useCloudStorage } from '@vkruglikov/react-telegram-web-app';
import { ethers, Wallet, JsonRpcProvider } from 'ethers';
import { useState, useEffect, useCallback } from 'react';

const rpcURL = 'https://polygon-amoy.drpc.org';
const rpc = new JsonRpcProvider(rpcURL);
const walletKeyCloud = 'wallet_backup';

export const useWalletApp = () => {
  const cloud = useCloudStorage();

  const [wallet, setWallet] = useState<ethers.Wallet>();

  const backUPWallet = useCallback(async () => {
    const walletbackup = await cloud.getItem(walletKeyCloud);
    if (walletbackup) {
      const walletInit = new ethers.Wallet(walletbackup, rpc);
      return setWallet(walletInit);
    } else {
      const walletInit = Wallet.createRandom(new JsonRpcProvider(rpcURL));
      await cloud.setItem(walletKeyCloud, walletInit.privateKey);
      return setWallet(walletInit as unknown as ethers.Wallet);
    }
  }, [cloud]);

  useEffect(() => {
    if (!wallet) backUPWallet();
  }, []);

  return wallet;
};
