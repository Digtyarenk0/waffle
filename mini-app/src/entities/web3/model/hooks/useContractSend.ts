import { BigNumber } from '@ethersproject/bignumber';
import { TransactionRequest, TransactionResponse } from '@ethersproject/providers';
import retry from 'async-retry';
import Big from 'big.js';
import { Contract } from 'ethers';
import { Deferrable } from 'ethers/lib/utils';
import { useCallback } from 'react';
import { toast } from 'react-toastify';

import { RETRY_OPTIONS_TRANSACTION } from 'shared/constants/retry-config';
import { RPC_PROVIDERS } from 'shared/constants/rpc';

import { useTypedDispatch } from 'entities/store/model/useStore';
import { useWalletApp } from 'entities/wallet/model/context';
import { incTxCount } from 'entities/wallet/model/store';
import { SupportedChainId } from 'entities/wallet/model/types/chain';

import { GAS_LIMIT_ADDITIONAL, GAS_LIMIT_MULTIPLIER } from '../constant/gasLimit';
// import { isOverrides } from '../helper/check-interface';
import { ContractMethodsType, MethodParametersType } from '../types/contracts';

interface UseSingleSendOptions {
  gasLimitMultiplier?: number;
  gasLimitAdditional?: number;
  showErrorToast?: boolean;
}

interface SendMethodResponse<C extends Contract, M extends ContractMethodsType<C>> {
  contract: C;
  method: M;
  dataTx: Deferrable<TransactionRequest>;
  send: () => Promise<TransactionResponse>;
}

export interface SingleSendMethodResponse<C extends Contract, M extends ContractMethodsType<C>> {
  tx: SendMethodResponse<C, M> | null;
  error: any;
}

export const useSingleSendMethod = <
  C extends Contract,
  M extends ContractMethodsType<C>,
  P extends MethodParametersType<C, M>,
>(
  contract: C | null | undefined,
  methodName: M,
  options?: UseSingleSendOptions,
) => {
  const { account, wallet } = useWalletApp();
  const dispatch = useTypedDispatch();
  const {
    showErrorToast = false,
    gasLimitMultiplier = GAS_LIMIT_MULTIPLIER.default,
    gasLimitAdditional = GAS_LIMIT_ADDITIONAL.default,
  } = options || {};

  return useCallback(
    async (...inputs: P): Promise<SingleSendMethodResponse<C, M>> => {
      if (account) {
        if (contract && wallet) {
          const chainId: SupportedChainId = (await contract.provider.getNetwork()).chainId;
          try {
            const dataTx: Deferrable<TransactionRequest> = {
              to: contract.address,
            };
            // Multiply estimateGas by gasLimitMultiplier
            if (gasLimitMultiplier) {
              // let overrides: Overrides = {};

              const gasPrice = await contract.provider.getGasPrice();
              // Up gas price 10%
              dataTx.gasPrice = gasPrice.mul(BigNumber.from(110)).div(BigNumber.from(100));

              const estimateGas: BigNumber = (await retry(async (bail) => {
                try {
                  return await contract.estimateGas[methodName](...inputs);
                } catch (e: any) {
                  if (JSON.stringify(e).includes('allowance')) {
                    throw e;
                  } else {
                    bail(e);
                  }
                }
              }, RETRY_OPTIONS_TRANSACTION)) as BigNumber;

              const gasLimitModified = Big(estimateGas.toString()).mul(gasLimitMultiplier);

              if (gasLimitAdditional) {
                gasLimitModified.add(gasLimitAdditional);
              }

              dataTx.gasLimit = gasLimitModified.toFixed(0);
            }

            dataTx.data = contract.interface.encodeFunctionData(methodName, inputs);
            const connectedWallet = wallet.connect(RPC_PROVIDERS[chainId]);
            dataTx.nonce = await connectedWallet.getTransactionCount();

            const send = () => {
              const tx = connectedWallet.sendTransaction(dataTx);
              dispatch(incTxCount());
              return tx;
            };

            return {
              tx: {
                contract,
                method: methodName,
                dataTx,
                send,
              },
              error: null,
            };
          } catch (e: any) {
            console.error('useSingleSendMethod ERROR', methodName, inputs, e);
            const parsedError = parseError(e, chainId);
            showErrorToast && parseToastError(e, chainId);
            return {
              tx: null,
              error: parsedError?.message || parsedError,
            };
          }
        } else {
          toast.error(`Error`);
        }
      } else {
        toast.warning(`Connect wallet`);
      }
      return {
        tx: null,
        error: null,
      };
    },
    [account, contract, wallet, gasLimitMultiplier, gasLimitAdditional, showErrorToast, methodName, dispatch],
  );
};

const parseError = (error: any, chainId: number | undefined) => {
  switch (chainId) {
    // On the GOERLI network, any error is wrapped in UNPREDICTABLE_GAS_LIMIT error
    case SupportedChainId.POLYGON:
      return error?.code === 'UNPREDICTABLE_GAS_LIMIT' && error?.error?.message ? error.error : error;
    default:
      if (error?.code === 'ACTION_REJECTED') return `User rejected transaction`;
      if (error?.reason === 'bad address checksum') return `Wrong address`;
      return error;
  }
};

export const parseToastError = (error: any, chainId: number | undefined) => {
  const parsedError = parseError(error, chainId);
  const isRPCERR =
    error?.message === 'NetworkError when attempting to fetch resource.' ||
    error?.message === "Non-200 status code: '429'";
  if (isRPCERR) {
    const msg = `Your RPC provider limits the number of requests. Consider changing the RPC provider or waiting.`;
    return toast.error(msg);
  }
  return toast.error(parsedError);
};
