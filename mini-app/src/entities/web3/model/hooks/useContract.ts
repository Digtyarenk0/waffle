import { getAddress } from '@ethersproject/address';
import { JsonRpcSigner, JsonRpcProvider } from '@ethersproject/providers';
import { Contract } from 'ethers';
import { useMemo } from 'react';

import { RPC_PROVIDERS } from 'shared/constants/rpc';

import { useWalletApp } from 'entities/wallet/model/context';
import { SupportedChainId } from 'entities/wallet/model/types/chain';

import { DEAD_ADDRESS } from '../constant/adresess';
import { ERC20, ERC20__factory } from '../contracts/typechain/erc20';
import { ChainLinkAggregatorV3InterfaceABI } from '../types/chainlink';

// returns the checksummed address if the address is valid, otherwise returns false
export function isAddress(value: any): string | false {
  try {
    return getAddress(value);
  } catch {
    return false;
  }
}

// account is not optional
export function getSigner(library: JsonRpcProvider, account: string): JsonRpcSigner {
  // @ts-ignore
  return library.getSigner(account).connectUnchecked();
}

// account is optional
function getProviderOrSigner(library: JsonRpcProvider, account?: string): JsonRpcProvider | JsonRpcSigner {
  return account ? getSigner(library, account) : library;
}

// account is optional
export function getContract<T extends Contract = Contract>(
  address: string,
  ABI: any,
  library: JsonRpcProvider,
  account?: string,
): T {
  if (!isAddress(address) || address === DEAD_ADDRESS) {
    throw Error(`Invalid 'address' parameter '${address}'.`);
  }

  const provider = getProviderOrSigner(library, account) as any;
  return new Contract(address, ABI, provider) as T;
}

export const useContract = <T extends Contract>(
  addressOrAddressMap:
    | string
    | {
        [chainId: number]: string;
      }
    | null
    | undefined,
  ABI: any,
): T | null => {
  const { provider, chainId, account } = useWalletApp();

  return useMemo(() => {
    if (!addressOrAddressMap || !ABI || !provider || !chainId) return null;
    const address = typeof addressOrAddressMap === 'string' ? addressOrAddressMap : addressOrAddressMap[chainId];
    if (!address) return null;
    try {
      return getContract<T>(address, ABI, provider, account ? account : undefined);
    } catch (error) {
      console.error('Failed to create contract', error);
      return null;
    }
  }, [addressOrAddressMap, ABI, provider, account, chainId]);
};

export const useContractByChain = <T extends Contract>(
  addressOrAddressMap:
    | string
    | {
        [chainId: number]: string;
      }
    | null
    | undefined,
  ABI: any,
  chainId: SupportedChainId,
  account?: string,
): T | null => {
  return useMemo(() => {
    if (!addressOrAddressMap || !ABI || !chainId) return null;
    const address = typeof addressOrAddressMap === 'string' ? addressOrAddressMap : addressOrAddressMap[chainId];

    if (!address) return null;
    try {
      return getContract<T>(address, ABI, RPC_PROVIDERS[chainId], account);
    } catch (error) {
      console.error('Failed to create contract', error);
      return null;
    }
  }, [addressOrAddressMap, ABI, account, chainId]);
};

export const useERC20Contract = (
  erc20Address: string | null | undefined,
  chainId: SupportedChainId,
  account?: string,
) => {
  return useContractByChain<ERC20>(erc20Address, ERC20__factory.abi, chainId, account);
};

export const useChainlinkContract = (feeAddress: string) => {
  return useContract(feeAddress, ChainLinkAggregatorV3InterfaceABI);
};
