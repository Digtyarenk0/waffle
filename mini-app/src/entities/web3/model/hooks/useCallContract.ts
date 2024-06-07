import retry, { Options } from 'async-retry';
import { Contract } from 'ethers';
import { has } from 'lodash-es';
import { useState, useRef, useCallback, useMemo } from 'react';

import { RETRY_OPTIONS_LOW } from 'shared/constants/retry-config';
import { useSyncEffect } from 'shared/hooks/useSyncEffect';

import { DEFAULT_CHAIN_ID, SupportedChainId } from 'entities/wallet/model/types/chain';

import { ContractMethodsType, MethodParametersType, MethodReturnType } from '../types/contracts';

import { useCallDeps } from './useCallDeps';

interface Option<T> {
  chainId?: SupportedChainId;
  depBlock?: boolean; // Update information with each new block
  defaultValue?: T; // The default value to be returned during a request or after an error
  disabled?: boolean; // In some cases we need to stop receiving updates
  resetIfDisabled?: boolean; // If resetIfDisabled===true and disabled===true then the result value will be reset to defaultValue.
  extraDeps?: any[];
}

export interface CallState<T> {
  readonly result: T;
  readonly loading: boolean;
  readonly error: any;
}

export interface UseSingleCallResult<T, U> extends CallState<T> {
  readonly argsCache: U;
}

export const useSingleCallMethod = <
  C extends Contract,
  M extends ContractMethodsType<C>,
  P extends MethodParametersType<C, M>,
  Result extends MethodReturnType<C, M>,
  Default = null,
>(
  contract: C | null | undefined,
  methodName: M,
  inputs: P,
  {
    chainId = DEFAULT_CHAIN_ID,
    depBlock = false,
    disabled = false,
    defaultValue,
    resetIfDisabled = true,
    extraDeps = [],
  }: Option<Default> = {},
  retryOptions: Options = RETRY_OPTIONS_LOW,
): UseSingleCallResult<Result | Default, P | null> => {
  const blockDeps = useCallDeps();
  const [cachedDefaultValue] = useState<Default>(defaultValue ?? (null as unknown as Default));
  const [result, setResult] = useState<{ [chainId: number]: Result | Default }>({});
  const [argsCache, setArgsCache] = useState<Record<number, P | null>>({});

  // For some cases, we need to instantly get a fresh loading value,
  // but through setLoading, the value will only be updated on the next render
  const loadingRef = useRef<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const [error, setError] = useState<Error | null>(null);

  const setLoadingState = useCallback((value: boolean) => {
    setLoading(value);
    loadingRef.current = value;
  }, []);

  useSyncEffect(() => {
    if (disabled && resetIfDisabled && chainId && result[chainId] !== cachedDefaultValue) {
      setResult((prev) => ({ ...prev, [chainId]: cachedDefaultValue }));
    }

    if (disabled && loading) setLoadingState(false);
    if (disabled && error) setError(null);
  }, [disabled, chainId]);

  useSyncEffect(() => {
    if (!contract || !chainId || disabled) return;

    const stale: Stale = { value: false };
    const fetch = async () =>
      await retry((bail) => {
        if (stale.value) {
          bail(new Error('stale'));
          return;
        }
        return contract.callStatic[methodName as string](...inputs);
      }, retryOptions);
    const setResultAndArgs: (result: Result | Default) => void = (result) => {
      setResult((prev) => ({ ...prev, [chainId]: result }));
      setArgsCache((prev) => ({ ...prev, [chainId]: inputs }));
    };
    fetchStateHandler<Result | Default>(
      cachedDefaultValue,
      result[chainId],
      (result) => setResultAndArgs(result),
      error,
      setError,
      setLoadingState,
      stale,
      fetch,
      (e) => {
        console.error('useSingleCallMethod ERROR', methodName, inputs, `contract address: ${contract.address}`, e);
      },
    );

    return () => {
      stale.value = true;
      if (loading) setLoadingState(false);
    };
  }, [depBlock && blockDeps, contract, methodName, JSON.stringify(inputs), disabled, chainId, ...extraDeps]);

  const freshLoading = loading || loadingRef.current;
  return useMemo(
    () => ({
      result: chainId && has(result, chainId) ? result[chainId] : cachedDefaultValue,
      loading: freshLoading,
      error,
      argsCache: chainId && has(argsCache, chainId) ? argsCache[chainId] : null,
    }),
    [result, freshLoading, error, chainId, argsCache],
  );
};

type Stale = { value: boolean };
const fetchStateHandler = async <T>(
  defaultValue: T,
  prevResult: T,
  setResult: (result: T) => void,
  error: any,
  setError: React.Dispatch<React.SetStateAction<any>>,
  setLoading: (value: boolean) => void,
  stale: Stale,
  fetch: () => Promise<T>,
  errorHandler?: (error: any) => void,
) => {
  try {
    setLoading(true);
    const fetchResult: T = await fetch();
    if (JSON.stringify(fetchResult) !== JSON.stringify(prevResult) && !stale.value) {
      setResult(fetchResult);
      error && setError(null);
    }
  } catch (e: any) {
    !stale.value && errorHandler && errorHandler(e);
    if (!stale.value) {
      setError(e);
      setResult(defaultValue);
    }
  } finally {
    if (!stale.value) setLoading(false);
  }
};
