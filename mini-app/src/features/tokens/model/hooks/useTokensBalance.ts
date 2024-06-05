import { useEffect, useMemo } from 'react';

import useDebounce from 'shared/hooks/useDebounce';

import { useTypedDispatch, useTypedSelector } from 'entities/store/model/useStore';
import { useWalletApp } from 'entities/wallet/model/context';
import { ZERO_ADDRESS } from 'entities/web3/model/constant/adresess';
import { useSingleCallMethod } from 'entities/web3/model/hooks/useCallContract';
import { useCallDeps } from 'entities/web3/model/hooks/useCallDeps';
import { useERC20Contract, useMulticallContract } from 'entities/web3/model/hooks/useContract';
import { MulticallBalancesResult } from 'entities/web3/model/types/contracts';

import { ITokenList, updateTokens } from '../store';

const gasLimit = 1000000;

export const useFetchTokensBalance = () => {
  const dispatch = useTypedDispatch();
  const tokensList = useTypedSelector((s) => s.tokens.list);

  const { provider, account } = useWalletApp();

  const blockDeps = useCallDeps();
  const erc20 = useERC20Contract(ZERO_ADDRESS);
  const multicallContract = useMulticallContract();

  const callData = useMemo(
    () => erc20?.interface.encodeFunctionData('balanceOf', [account]),
    [erc20?.interface, account],
  );

  const tokensListDebunce = useDebounce(tokensList, 200).value;
  const calls = useMemo(
    () =>
      !tokensListDebunce
        ? []
        : tokensListDebunce.map((t) => ({
            target: t.address,
            callData,
            gasLimit,
          })),
    [tokensListDebunce?.length, blockDeps],
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
      result
        ?.map((b, i) => {
          const token = tokensList?.[i] as ITokenList;
          return {
            ...token,
            balanceWei: b.toString(),
          };
        })
        .filter((t) => t.balanceWei !== '0'),
    [result, tokensList?.length],
  );

  const tokensWithBalance = useDebounce(tokens, 150).value;
  useEffect(() => {
    if (tokensWithBalance) {
      dispatch(updateTokens(tokensWithBalance));
    }
  }, [tokensWithBalance]);

  return;
};
