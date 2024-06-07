import { useEffect, useMemo, useState } from 'react';

import useDebounce from 'shared/hooks/useDebounce';
import { weiToAmount } from 'shared/utils/amount';

import { useTypedDispatch, useTypedSelector } from 'entities/store/model/useStore';
import { useWalletApp } from 'entities/wallet/model/context';
import { SupportedChainId } from 'entities/wallet/model/types/chain';
import { MOCK_ADDRESS } from 'entities/web3/model/constant/adresess';
import { useSingleCallMethod } from 'entities/web3/model/hooks/useCallContract';
import { useCallDeps } from 'entities/web3/model/hooks/useCallDeps';
import { useChainlinkContract } from 'entities/web3/model/hooks/useContract';
import { useMulticallContract } from 'entities/web3/model/hooks/useMulticallContract';
import { MulticallBalancesResult, MulticallCallData } from 'entities/web3/model/types/contracts';

import { ChainlinkFeed, PRICE_FEENDS_BY_CHAIN } from '../constants/feeds';
import { IToken, ITokenPrice, addTokensPrices } from '../store';

interface CallTokenData {
  token: IToken;
  feed: ChainlinkFeed;
  call: MulticallCallData;
}

const gasLimit = 1000000;
const chainId = SupportedChainId.POLYGON;

export const useFeedTokens = () => {
  const dispatch = useTypedDispatch();
  const { provider } = useWalletApp();

  const blockDeps = useCallDeps();
  const tokens = useTypedSelector((s) => s.tokens.tokens);
  const [feedsTokens, setFeedsTokens] = useState<CallTokenData[]>();

  const fee = useChainlinkContract(MOCK_ADDRESS, chainId); // for encode/decode

  const multicallContract = useMulticallContract(chainId);

  const tokensDebunce = useDebounce(tokens, 200).value;
  const callData = useMemo(() => fee?.interface.encodeFunctionData('latestRoundData', []) as string, [fee?.interface]);
  const priceFeed = useMemo(() => PRICE_FEENDS_BY_CHAIN[chainId], [chainId]);

  const calls = useMemo(() => feedsTokens?.map(({ call }) => call), [feedsTokens]);

  const disabled = useMemo(
    () => !provider || !multicallContract || !fee || !calls || calls.length === 0,
    [provider, multicallContract, fee, calls?.length],
  );

  const multicallRes = useSingleCallMethod(multicallContract, 'multicall', [calls], {
    disabled,
  }).result as MulticallBalancesResult;

  const result = useMemo(() => {
    if (!multicallRes?.returnData || !fee || disabled) return null;
    return multicallRes.returnData.map(
      ({ returnData }) => fee.interface.decodeFunctionResult('latestRoundData', returnData) as any,
    );
  }, [multicallRes?.returnData, disabled]);

  useEffect(() => {
    if (!tokensDebunce) return;
    const feeds = [] as CallTokenData[];
    tokensDebunce.forEach((token) => {
      priceFeed.find((feed) => {
        // use only USD feed
        if (feed.pL === token.symbol && feed.pR === 'USD')
          feeds.push({
            token,
            feed,
            call: {
              target: feed.address,
              callData,
              gasLimit,
            },
          });
      });
    });
    setFeedsTokens(feeds);
  }, [tokensDebunce?.length, blockDeps]);

  useEffect(() => {
    if (result && feedsTokens) {
      const pricesTokens = result.map((v, i) => {
        const data = feedsTokens[i];
        return {
          address: data.token.address,
          priceUSD: weiToAmount(v.answer, data.feed.decimals).toString(),
        } as ITokenPrice;
      });
      dispatch(addTokensPrices(pricesTokens));
    }
  }, [result, feedsTokens]);

  return;
};
