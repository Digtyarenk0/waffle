import { getAddress } from '@ethersproject/address';
import { JsonRpcSigner, JsonRpcProvider } from '@ethersproject/providers';
import { Contract } from 'ethers';
import { useMemo } from 'react';

import { RPC_PROVIDERS } from 'shared/constants/rpc';

import { useWalletApp } from 'entities/wallet/model/context';
import { SupportedChainId } from 'entities/wallet/model/types/chain';

import UniswapMulticallABI from '../abis/uniswap-multicall.json';
import { DEAD_ADDRESS, UNISWAP_MULTICALL_ADDRESSES } from '../constant/adresess';
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

export const useContractCallChain = <T extends Contract>(
  addressOrAddressMap:
    | string
    | {
        [chainId: number]: string;
      }
    | null
    | undefined,
  ABI: any,
  chainId: SupportedChainId,
): T | null => {
  return useMemo(() => {
    if (!addressOrAddressMap || !ABI || !chainId) return null;
    const address = typeof addressOrAddressMap === 'string' ? addressOrAddressMap : addressOrAddressMap[chainId];

    if (!address) return null;
    try {
      return getContract<T>(address, ABI, RPC_PROVIDERS[chainId]);
    } catch (error) {
      console.error('Failed to create contract', error);
      return null;
    }
  }, [addressOrAddressMap, ABI, chainId, chainId]);
};

export const useMulticallContract = () => {
  return useContract(UNISWAP_MULTICALL_ADDRESSES, UniswapMulticallABI);
};

export const useMulticallContractChain = (chainId: SupportedChainId) => {
  return useContractCallChain(UNISWAP_MULTICALL_ADDRESSES, UniswapMulticallABI, chainId);
};

export const useERC20Contract = (erc20Address: string | null | undefined) => {
  return useContract<ERC20>(erc20Address, ERC20__factory.abi);
};

export const useChainlinkContract = (feeAddress: string) => {
  return useContract(feeAddress, ChainLinkAggregatorV3InterfaceABI);
};
