import retry from 'async-retry';
import Big from 'big.js';
import { Contract } from 'ethers';
import { useCallback, useEffect, useState } from 'react';

import { RETRY_OPTIONS_LOW } from 'shared/constants/retry-config';

import { useWalletApp } from 'entities/wallet/model/context';

import { GAS_LIMIT_MULTIPLIER, GAS_LIMIT_ADDITIONAL } from '../constant/gasLimit';
import { ContractMethodsType, MethodParametersType } from '../types/contracts';

import { useCallDeps } from './useCallDeps';

type Options = {
  disabled?: boolean;
  depBlock?: boolean;
  gasLimitMultiplier?: number;
  gasLimitAdditional?: number;
};

export const useContractEstimatedGas = <
  C extends Contract,
  M extends ContractMethodsType<C>,
  P extends MethodParametersType<C, M>,
>(
  contract: C | null | undefined,
  methodName: M,
  inputs?: P,
  {
    depBlock = false,
    disabled = false,
    gasLimitMultiplier = GAS_LIMIT_MULTIPLIER.default,
    gasLimitAdditional = GAS_LIMIT_ADDITIONAL.default,
  }: Options = {},
) => {
  const [estimatedGas, setEstimatedGas] = useState('0');

  useEffect(() => {
    const estimateGas = async () => {
      if (!disabled && contract) {
        try {
          const estimatedGas = await retry(
            () => contract.estimateGas[methodName](...(inputs || [])),
            RETRY_OPTIONS_LOW,
          );

          const gasLimitModified = Big(estimatedGas.toString()).mul(gasLimitMultiplier).add(gasLimitAdditional);

          setEstimatedGas(gasLimitModified.toFixed(0));
        } catch (e: any) {
          console.error('useContractEstimatedGas ERROR', methodName, inputs, e);
        }
      } else {
        setEstimatedGas('0');
      }
    };

    estimateGas();
  }, [disabled, gasLimitMultiplier, gasLimitAdditional, JSON.stringify(inputs), methodName]);

  return estimatedGas;
};
