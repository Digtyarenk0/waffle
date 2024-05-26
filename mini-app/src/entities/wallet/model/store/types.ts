import { ethers } from 'ethers';

export interface WalletStore {
  wallet?: ethers.Wallet;
  provider?: ethers.Provider;
  address?: string;
  balance?: string;
}
