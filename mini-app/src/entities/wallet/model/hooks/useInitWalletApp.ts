import { useCloudStorage } from '@vkruglikov/react-telegram-web-app';
import { ethers, Wallet } from 'ethers';
import { useEffect, useCallback } from 'react';

import { useTypedDispatch, useTypedSelector } from 'entities/store/model/useStore';

import { RPC_PROVIDERS } from '../constants/rpc';
import { addWallet } from '../store';
import { SupportedChainId } from '../types/chain';

const walletKeyCloud = 'wallet_backup';
const chain = SupportedChainId.AMOY;

export const useInitWallet = () => {
  const cloud = useCloudStorage();

  const wallet = useTypedSelector((s) => s.wallet.wallet);
  const dispatch = useTypedDispatch();

  const backUPWallet = useCallback(async () => {
    const walletbackup = await cloud.getItem(walletKeyCloud);
    if (walletbackup) {
      const walletInit = new ethers.Wallet(walletbackup, RPC_PROVIDERS[chain]);
      dispatch(addWallet(walletInit as unknown as ethers.Wallet));
    } else {
      const walletInit = Wallet.createRandom(RPC_PROVIDERS[chain]);
      await cloud.setItem(walletKeyCloud, walletInit.privateKey);
      dispatch(addWallet(walletInit as unknown as ethers.Wallet));
    }
  }, [cloud]);

  useEffect(() => {
    if (!wallet) backUPWallet();
  }, []);
};
