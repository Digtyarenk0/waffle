import { Contract } from 'ethers';
import { useMemo } from 'react';

import { SupportedChainId } from 'entities/wallet/model/types/chain';

import UniswapMulticallABI from '../abis/uniswap-multicall.json';
import { UNISWAP_MULTICALL_ADDRESSES } from '../constant/adresess';

import { useContract, useContractCallChain } from './useContract';

export const useMulticallContract = () => {
  return useContract(UNISWAP_MULTICALL_ADDRESSES, UniswapMulticallABI);
};

export const useMulticallContractChains = (): Record<SupportedChainId, Contract> | null => {
  const polygon = useContractCallChain(UNISWAP_MULTICALL_ADDRESSES, UniswapMulticallABI, SupportedChainId.POLYGON);
  const arbitrum = useContractCallChain(
    UNISWAP_MULTICALL_ADDRESSES,
    UniswapMulticallABI,
    SupportedChainId.ARBITRUM_SEPOLIA,
  );

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
