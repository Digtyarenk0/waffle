import Big from 'big.js';
import classNames from 'classnames';
import { useCallback, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { HiWallet } from 'react-icons/hi2';
import { useSearchParams } from 'react-router-dom';

import { CHAIN_INFO } from 'shared/constants/chain';
import { routes } from 'shared/constants/routes';
import { ButtonPastFromBuffer } from 'shared/ui/button-buffer/ui';
import { Input } from 'shared/ui/input';
import { maxDecimalsInput } from 'shared/ui/input/model/helper/validators/number';
import { TransactionInfoBlock } from 'shared/ui/transaction-info';
import { amountToWei, weiToAmount } from 'shared/utils/amount';

import { useTypedSelector } from 'entities/store/model/useStore';
import { useWalletApp } from 'entities/wallet/model/context';
import { DEFAULT_CHAIN_ID } from 'entities/wallet/model/types/chain';
import { useERC20Contract } from 'entities/web3/model/hooks/useContract';
import { useContractEstimatedGas } from 'entities/web3/model/hooks/useContractEstimatedGas';
import { useSingleSendMethod } from 'entities/web3/model/hooks/useContractSend';
import { TransactionState } from 'entities/web3/model/types/contracts';

interface Form {
  amount: string;
  address: string;
}
export const SendTokenTo = () => {
  const [searchParams] = useSearchParams();
  const { account } = useWalletApp();
  const tokens = useTypedSelector((s) => s.tokens.tokens || []);
  const paramSendToken = useMemo(() => searchParams.get(routes.send_token), [searchParams]);
  const sendToken = useMemo(() => tokens.find((t) => t.address === paramSendToken), [tokens, paramSendToken]);

  const chainId = useMemo(() => sendToken?.chainId || DEFAULT_CHAIN_ID, [sendToken]);

  const tokenContract = useERC20Contract(sendToken?.address, chainId, account);
  const transferToken = useSingleSendMethod(tokenContract, 'transfer');

  const [txLoading, setTxLoading] = useState<boolean>(false);
  const [txResult, setTxResult] = useState<TransactionState>();

  const {
    register,
    setValue,
    trigger,
    watch,
    formState: { errors, isValid },
  } = useForm<Form>({
    defaultValues: {
      address: '0x5b927c461b71Ce25a74878dBe504492Ab80cbeE4',
      amount: '0.001',
    },
    mode: 'all',
  });

  const [address, amount] = watch(['address', 'amount']);

  // const estimatedGas = '10000';
  const estimatedGas = useContractEstimatedGas(tokenContract, 'transfer', [account, 1], {
    depBlock: false,
    disabled: !account || !tokenContract || !sendToken,
  });

  const symbol = useMemo(() => sendToken?.symbol || '', [sendToken?.symbol]);
  const balance = useMemo(
    () => weiToAmount(sendToken?.balanceWei || 0, sendToken?.decimals || 18).toFixed(4),
    [sendToken?.balanceWei],
  );

  const setAddressFromBuffer = useCallback(
    (v: string) => {
      setValue('address', v);
      trigger('address');
    },
    [setValue, trigger],
  );

  const resetInput = useCallback(
    (v: string) => {
      setValue(v as keyof Form, '');
      trigger(v as keyof Form);
    },
    [setValue, trigger],
  );

  const setMaxAmount = useCallback(() => {
    setValue('amount', balance);
    trigger('amount');
  }, [setValue, trigger, balance]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value === '' ? '0' : e.target.value;
    if (balance) {
      const isMoreBalance = Big(v).gt(balance) || 0;
      if (isMoreBalance) {
        e.target.value = balance.toString();
        return e;
      }
    }
    const decimal = maxDecimalsInput(e, 6);
    if (decimal) {
      e.target.value = decimal;
    }
    return e;
  };

  const handleTransferToken = async () => {
    if (!sendToken?.address || !address || !amount || !tokenContract) return;
    setTxLoading(true);
    setTxResult(undefined);
    const transferAmount = amountToWei(amount, sendToken.decimals).toString();
    try {
      const txData = await transferToken(address, transferAmount);
      console.log('txData:', txData);
      setTxResult(txData);
    } catch (error: any) {
      console.log(error?.message);
    } finally {
      setTxLoading(false);
      // setValue('address', '');
      // setValue('amount', '');
      // trigger(['address', 'amount']);
    }
  };

  return (
    <div className="container mx-auto h-full overflow-y-scroll p-4 flex flex-col justify-between">
      <div>
        <p className="text-2xl text-center mb-4 mt-5">
          Send {symbol} on {CHAIN_INFO[sendToken?.chainId || DEFAULT_CHAIN_ID].label}
        </p>
        <div>
          <p className="font-medium text-gray-main">Address or domain</p>
          <div className="relative">
            <Input
              classNameInput="w-full p-2 pl-4 pr-14"
              register={register('address')}
              errors={errors}
              type="text"
              placeholder={`Search or Enter`}
              example={``}
            />
            <ButtonPastFromBuffer
              className="absolute top-2 right-4 font-semibold text-green-main"
              setBufferValue={setAddressFromBuffer}
            />
          </div>
        </div>
        <div className="mt-4">
          <div className="flex justify-between">
            <p className="font-medium text-gray-main">Amount</p>
            <div className="flex items-center">
              <HiWallet size="15px" className=" text-gray-main mr-1" />
              <p className="text-xs font-medium text-gray-main">{balance}</p>
            </div>
          </div>
          <div className="relative">
            <Input
              classNameInput="w-full p-2 pl-4 pr-18"
              register={register('amount', {
                onChange,
              })}
              reset={resetInput}
              errors={errors}
              type="text"
              placeholder={`${symbol} Amount`}
              example={``}
            />
            <p className="absolute top-2 right-9 font-medium text-gray-main">{symbol}</p>
            <button className="absolute -bottom-6 right-3 text-sm font-medium text-green-main" onClick={setMaxAmount}>
              MAX
            </button>
          </div>
          <p className="text-gray-main text-xs font-medium mt-1">
            fee: ~{weiToAmount(estimatedGas || 0, 10).toString()} {CHAIN_INFO[chainId].nativeCurrency.symbol}
          </p>
        </div>
        {/* // Data */}
        <div className="mt-12">
          <TransactionInfoBlock
            hash={txResult?.result?.transactionHash}
            gasUsed={txResult?.result?.gasUsed.toString()}
            chainId={sendToken?.chainId}
          />
        </div>
      </div>
      <div className="mb-10">
        <button
          className={classNames(
            'w-full h-10 rounded-2xl mt-2 flex items-center justify-center',
            !(!isValid || txLoading) ? 'text-black-theme font-semibold bg-green-main' : 'bg-gray-main',
          )}
          disabled={!isValid || txLoading}
          onClick={handleTransferToken}
          type="submit"
        >
          {txLoading ? 'Processing' : 'Send'}
        </button>
      </div>
    </div>
  );
};
