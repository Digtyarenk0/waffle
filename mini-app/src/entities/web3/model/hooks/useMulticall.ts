import { BigNumber } from '@ethersproject/bignumber';
import { Contract } from 'ethers';
import { useMemo } from 'react';

import { RETRY_OPTIONS_HIGH } from 'shared/constants/retry-config';

import { useSingleCallMethod } from './useCallContract';
import { useMulticallContract } from './useContract';

interface MulticallBalancesResult {
  blockNumber: BigNumber;
  returnData: { returnData: string }[];
}

interface Params {
  gasLimit?: number;
  disabled?: boolean;
  depBlock?: boolean;
  defaultValue?: BigNumber;
}
const defaultGasLimit = 100_000_000_000;

export const useContractMulticallMethod = <Res>(
  contract: Contract | null | undefined,
  method: string,
  args: any[][] | any[],
  params: Params,
) => {
  const multicallContract = useMulticallContract();
  const { gasLimit = defaultGasLimit, disabled = false, depBlock = false, defaultValue } = params;

  const callDatas = useMemo(
    () =>
      args.map((arg) => {
        if (!contract || disabled || !arg) return '';
        return contract.interface.encodeFunctionData(method, arg);
      }),
    [disabled, contract, method, args],
  );

  const call = useSingleCallMethod(
    multicallContract,
    'multicall',
    [
      callDatas.map((callData) => ({
        target: contract?.address,
        callData,
        gasLimit,
      })),
    ],
    { disabled: disabled || !contract || callDatas[0] === '', depBlock, defaultValue },
    RETRY_OPTIONS_HIGH,
  );

  const res = call.result as MulticallBalancesResult | undefined;

  const result = useMemo(() => {
    if (!res?.returnData || !contract) return null;
    return res.returnData.map(({ returnData }) => contract.interface.decodeFunctionResult(method, returnData) as Res);
  }, [res?.returnData, contract, method]);

  return useMemo(
    () => ({
      ...call,
      result,
    }),
    [call, result],
  );
};
