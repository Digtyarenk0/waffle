import { BigNumber } from 'ethers';
import { useEffect, useMemo } from 'react';

import useDebounce from 'shared/hooks/useDebounce';

import { useTypedDispatch, useTypedSelector } from 'entities/store/model/useStore';
import { useWalletApp } from 'entities/wallet/model/context';
import { SupportedChainId } from 'entities/wallet/model/types/chain';
import { ZERO_ADDRESS } from 'entities/web3/model/constant/adresess';
import { useSingleCallMethod } from 'entities/web3/model/hooks/useCallContract';
import { useCallDeps } from 'entities/web3/model/hooks/useCallDeps';
import { useERC20Contract, useMulticallContractChain } from 'entities/web3/model/hooks/useContract';
import { MulticallBalancesResult } from 'entities/web3/model/types/contracts';

import { updateTokens } from '../../store';

import { CALL_DATA, callDataByTokenList, mapBalanceResult } from './helper-balance';

const gasLimit = 1000000;
const callData = CALL_DATA.balanceOf;

export const useFetchTokensBalance = () => {
  const dispatch = useTypedDispatch();
  const tokensList = useTypedSelector((s) => s.tokens.list);

  const { account } = useWalletApp();

  const blockDeps = useCallDeps();
  const erc20 = useERC20Contract(ZERO_ADDRESS);

  const multicallPolygon = useMulticallContractChain(SupportedChainId.POLYGON);
  const multicallArbitrum = useMulticallContractChain(SupportedChainId.ARBITRUM_SEPOLIA);

  const tokensListDebunce = useDebounce(tokensList, 200).value;
  const calls = useMemo(
    () => callDataByTokenList(callData, gasLimit, tokensListDebunce),
    [tokensListDebunce?.length, blockDeps],
  );

  const disabled = useMemo(
    () => !multicallPolygon || !multicallArbitrum || !erc20 || !tokensList || !account || !calls,
    [multicallPolygon, multicallArbitrum, erc20, tokensList, account, calls],
  );

  const responsePolygon = useSingleCallMethod(multicallPolygon, 'multicall', [calls?.polygon?.calls], {
    depBlock: true,
    disabled: disabled || !calls?.polygon,
  }).result as MulticallBalancesResult | undefined;
  const responseArbitrum = useSingleCallMethod(multicallArbitrum, 'multicall', [calls?.arbitrum?.calls], {
    depBlock: true,
    disabled: disabled || !calls?.arbitrum,
  }).result as MulticallBalancesResult | undefined;

  const resultPolygon = useMemo(() => {
    if (!responsePolygon?.returnData || !erc20 || disabled || !calls?.polygon) return;
    return responsePolygon.returnData.map(({ returnData }) => {
      if (returnData === '0x') return BigNumber.from(0);
      return erc20.interface.decodeFunctionResult('balanceOf', returnData) as unknown as BigNumber;
    });
  }, [responsePolygon?.returnData, calls?.polygon, disabled]);

  const resultArbitrum = useMemo(() => {
    if (!responseArbitrum?.returnData || !erc20 || disabled || !calls?.arbitrum) return;
    return responseArbitrum.returnData.map(({ returnData }) => {
      if (returnData === '0x') return BigNumber.from(0);
      return erc20.interface.decodeFunctionResult('balanceOf', returnData) as unknown as BigNumber;
    });
  }, [responseArbitrum?.returnData, calls?.arbitrum, disabled]);

  const tokens = useMemo(() => {
    const polygon = mapBalanceResult(resultPolygon, calls?.polygon?.tokens);
    const arbitrum = mapBalanceResult(resultArbitrum, calls?.arbitrum?.tokens);
    console.log('arbitrum:', { resultArbitrum, cals: calls?.arbitrum });
    return [...polygon, ...arbitrum];
  }, [resultPolygon, resultArbitrum, calls]);

  const tokensWithBalance = useDebounce(tokens, 150).value;
  useEffect(() => {
    if (tokensWithBalance) {
      // console.log({ tokensWithBalance });
      dispatch(updateTokens(tokensWithBalance));
    }
  }, [tokensWithBalance]);

  return;
};
