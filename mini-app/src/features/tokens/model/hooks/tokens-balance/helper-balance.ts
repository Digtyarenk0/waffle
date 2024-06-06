import { BigNumber } from 'ethers';

import { SupportedChainId } from 'entities/wallet/model/types/chain';

import { ITokenList } from '../../store';

export const CALL_DATA = {
  // erc20?.interface.encodeFunctionData('balanceOf', [account]),
  balanceOf: '0x70a082310000000000000000000000005b927c461b71ce25a74878dbe504492ab80cbee4',
};

// target: t.address,
// callData,
// gasLimit,
export const mapTokenToCall = (token: ITokenList, callData: string, gasLimit: number) => ({
  target: token.address,
  callData,
  gasLimit,
});

export const mapBalanceResult = (results?: BigNumber[], tokens?: ITokenList[]) =>
  results && tokens
    ? results
        ?.map((b, i) => {
          const token = tokens[i] as ITokenList;
          return {
            ...token,
            balanceWei: b.toString(),
          };
        })
        .filter((t) => t.balanceWei !== '0')
    : [];

export const callDataByTokenList = (callData: string, gasLimit: number, list?: ITokenList[]) => {
  if (!list) return;
  const polygonTokens = list.filter((t) => t.chainId === SupportedChainId.POLYGON);
  const arbitrumTokens = list.filter((t) => t.chainId === SupportedChainId.ARBITRUM_SEPOLIA);
  const polygonCalls = polygonTokens.map((t) => mapTokenToCall(t, callData, gasLimit));
  const arbitrumCalls = arbitrumTokens.map((t) => mapTokenToCall(t, callData, gasLimit));
  return {
    polygon: polygonCalls.length > 0 ? { calls: polygonCalls, tokens: polygonTokens } : null,
    arbitrum: arbitrumCalls.length > 0 ? { calls: arbitrumCalls, tokens: arbitrumTokens } : null,
  };
};
