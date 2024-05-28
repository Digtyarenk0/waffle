import { BigNumber } from 'ethers';
import { useMemo } from 'react';

import { useWalletApp } from 'entities/wallet/model/context';

import { useFetchTokensListQuery } from 'features/tokens/model/hooks/useGetTokens';

import { useSingleCallMethod } from '../useCallContract';
import { useERC20Contract, useMulticallContract } from '../useContract';

const gasLimit = 1000000;

interface MulticallBalancesResult {
  blockNumber: BigNumber;
  returnData: { returnData: string }[];
}

export const useTokensBalance = () => {
  const { provider, chainId, account } = useWalletApp();
  const tokens = useFetchTokensListQuery(chainId).data;

  const erc20 = useERC20Contract('0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174');
  const multicallContract = useMulticallContract();

  const callData = useMemo(
    () => erc20?.interface.encodeFunctionData('balanceOf', [account]),
    [erc20?.interface, account],
  );
  const calls = useMemo(
    () =>
      !tokens
        ? []
        : tokens.map((t) => ({
            target: t.address,
            callData,
            gasLimit,
          })),
    [tokens?.length],
  );

  const disabled = useMemo(
    () => !provider || !multicallContract || !erc20 || !tokens || !account,
    [provider, multicallContract, erc20, tokens, account],
  );

  const multicallRes = useSingleCallMethod(multicallContract, 'multicall', [calls], {
    disabled,
  }).result as MulticallBalancesResult | undefined;

  const result = useMemo(() => {
    if (!multicallRes?.returnData || !erc20 || disabled) return null;
    return multicallRes.returnData.map(
      ({ returnData }) => erc20.interface.decodeFunctionResult('balanceOf', returnData) as any,
    );
  }, [multicallRes?.returnData, disabled]);

  return useMemo(
    () =>
      result?.map((b, i) => ({
        ...tokens?.[i],
        balanceWei: b?.toString(),
      })),
    [result, tokens],
  );
};
