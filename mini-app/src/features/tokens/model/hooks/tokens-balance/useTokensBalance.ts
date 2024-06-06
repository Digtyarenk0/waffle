import { BigNumber } from 'ethers';
import { useCallback, useEffect, useMemo } from 'react';

import useDebounce from 'shared/hooks/useDebounce';

import { useTypedDispatch, useTypedSelector } from 'entities/store/model/useStore';
import { useWalletApp } from 'entities/wallet/model/context';
import { SupportedChainId } from 'entities/wallet/model/types/chain';
import { ZERO_ADDRESS } from 'entities/web3/model/constant/adresess';
import { useSingleCallMethod } from 'entities/web3/model/hooks/useCallContract';
import { useCallDeps } from 'entities/web3/model/hooks/useCallDeps';
import { useERC20Contract } from 'entities/web3/model/hooks/useContract';
import { useMulticallContractChains } from 'entities/web3/model/hooks/useMulticallContract';
import { MulticallBalancesResult } from 'entities/web3/model/types/contracts';

import { CallDataByTokenList } from 'features/tokens/types';

import { IToken, updateTokens } from '../../store';

import { CALL_DATA, callDataByTokenList, mapBalanceResult, parseTokensBalanceMulticallResult } from './helper-balance';

const gasLimit = 1000000;
const callData = CALL_DATA.balanceOf;

const useCallsMethod = (
  calls: CallDataByTokenList,
  disabled: boolean,
): Record<SupportedChainId, MulticallBalancesResult | undefined> => {
  const multicall = useMulticallContractChains();

  const polygonCall = calls?.[SupportedChainId.POLYGON]?.calls;
  const arbitrumCall = calls?.[SupportedChainId.ARBITRUM_SEPOLIA]?.calls;

  const polygon = useSingleCallMethod(multicall?.[SupportedChainId.POLYGON], 'multicall', [polygonCall], {
    depBlock: true,
    disabled: disabled || !polygonCall,
  }).result as MulticallBalancesResult | undefined;
  const arbitrum = useSingleCallMethod(multicall?.[SupportedChainId.ARBITRUM_SEPOLIA], 'multicall', [arbitrumCall], {
    depBlock: true,
    disabled: disabled || !arbitrumCall,
  }).result as MulticallBalancesResult | undefined;

  return {
    [SupportedChainId.POLYGON]: polygon,
    [SupportedChainId.ARBITRUM_SEPOLIA]: arbitrum,
  };
};

export const useFetchTokensBalance = () => {
  const dispatch = useTypedDispatch();
  const tokensList = useTypedSelector((s) => s.tokens.list);

  const { account } = useWalletApp();

  const blockDeps = useCallDeps();
  const erc20 = useERC20Contract(ZERO_ADDRESS);

  const multicall = useMulticallContractChains();

  const tokensListDebunce = useDebounce(tokensList, 200).value;
  const calls = useMemo(
    () => callDataByTokenList(callData, gasLimit, tokensListDebunce),
    [tokensListDebunce?.length, blockDeps],
  );
  const decode = useCallback(
    (v: string) => erc20?.interface.decodeFunctionResult('balanceOf', v) as unknown as BigNumber,
    [erc20],
  );

  const disabled = useMemo(
    () => !multicall || !multicall || !erc20 || !tokensList || !account || !calls,
    [multicall, multicall, erc20, tokensList, account, calls],
  );

  const response = useCallsMethod(calls, disabled);

  const result = useMemo(() => {
    if (!decode || disabled || !calls) return;
    const chainResult = {} as Record<SupportedChainId, BigNumber[]>;
    Object.keys(calls).forEach((c) => {
      const chain = c as unknown as SupportedChainId;
      const callsData = calls[chain];
      const res = response[chain];
      if (!callsData || !res) return;
      const parsed = parseTokensBalanceMulticallResult(res, decode);
      if (parsed) chainResult[chain] = parsed;
    });
    return chainResult;
  }, [decode, disabled, calls, response]);

  const tokens: IToken[] = useMemo(() => {
    if (!result || !calls) return [] as IToken[];
    const tokensBalances = [] as IToken[][];
    Object.keys(result).forEach((c) => {
      const chain = c as unknown as SupportedChainId;
      if (!calls?.[chain]?.tokens) return;
      const resultChain = result[chain];
      const tokens = calls?.[chain]?.tokens;
      const balancesReult = mapBalanceResult(resultChain, tokens);
      tokensBalances.push(balancesReult);
    });
    return tokensBalances.flat();
  }, [result, calls]);

  const tokensWithBalance = useDebounce(tokens, 150).value;
  useEffect(() => {
    if (tokensWithBalance) {
      dispatch(updateTokens(tokensWithBalance));
    }
  }, [tokensWithBalance]);

  return;
};
