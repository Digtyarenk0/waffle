import { BigNumber } from 'ethers';
import { useEffect, useMemo } from 'react';

import { useTypedDispatch, useTypedSelector } from 'entities/store/model/useStore';
import { useWalletApp } from 'entities/wallet/model/context';
import { useSingleCallMethod } from 'entities/web3/model/hooks/useCallContract';
import { useERC20Contract, useMulticallContract } from 'entities/web3/model/hooks/useContract';

import { ITokenList, updateTokens } from '../store';

const gasLimit = 1000000;

interface MulticallBalancesResult {
  blockNumber: BigNumber;
  returnData: { returnData: string }[];
}

export const useFetchTokensBalance = () => {
  const dispatch = useTypedDispatch();
  const tokensList = useTypedSelector((s) => s.tokens.list);

  const { provider, account } = useWalletApp();

  const erc20 = useERC20Contract('0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174');
  const multicallContract = useMulticallContract();

  const callData = useMemo(
    () => erc20?.interface.encodeFunctionData('balanceOf', [account]),
    [erc20?.interface, account],
  );
  const calls = useMemo(
    () =>
      !tokensList
        ? []
        : tokensList.map((t) => ({
            target: t.address,
            callData,
            gasLimit,
          })),
    [tokensList?.length],
  );

  const disabled = useMemo(
    () => !provider || !multicallContract || !erc20 || !tokensList || !account || calls.length === 0,
    [provider, multicallContract, erc20, tokensList, account, calls.length],
  );

  const multicallRes = useSingleCallMethod(multicallContract, 'multicall', [calls], {
    depBlock: true,
    disabled,
  }).result as MulticallBalancesResult | undefined;

  const result = useMemo(() => {
    if (!multicallRes?.returnData || !erc20 || disabled) return null;
    return multicallRes.returnData.map(
      ({ returnData }) => erc20.interface.decodeFunctionResult('balanceOf', returnData) as any,
    );
  }, [multicallRes?.returnData, disabled]);

  const tokens = useMemo(
    () =>
      result?.map((b, i) => {
        const token = tokensList?.[i] as ITokenList;
        return {
          ...token,
          balanceWei: b.toString(),
        };
      }),
    [result, tokensList?.length],
  );

  useEffect(() => {
    if (tokens) {
      dispatch(updateTokens(tokens));
    }
  }, [tokens]);

  return;
};
