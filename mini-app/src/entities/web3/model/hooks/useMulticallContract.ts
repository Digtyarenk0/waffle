import { Contract } from 'ethers';
import { useMemo } from 'react';

import { SupportedChainId } from 'entities/wallet/model/types/chain';

import UniswapMulticallABI from '../abis/uniswap-multicall.json';
import { UNISWAP_MULTICALL_ADDRESSES } from '../constant/adresess';

import { useContract } from './useContract';

export const useMulticallContract = (chainId: SupportedChainId) => {
  return useContract(UNISWAP_MULTICALL_ADDRESSES, UniswapMulticallABI, chainId);
};

export const useMulticallContractChains = (): Record<SupportedChainId, Contract> | null => {
  const polygon = useContract(UNISWAP_MULTICALL_ADDRESSES, UniswapMulticallABI, SupportedChainId.POLYGON);
  const arbitrum = useContract(UNISWAP_MULTICALL_ADDRESSES, UniswapMulticallABI, SupportedChainId.ARBITRUM_SEPOLIA);

  return useMemo(
    () =>
      polygon && arbitrum
        ? {
            [SupportedChainId.POLYGON]: polygon,
            [SupportedChainId.ARBITRUM_SEPOLIA]: arbitrum,
          }
        : null,
    [arbitrum, polygon],
  );
};
