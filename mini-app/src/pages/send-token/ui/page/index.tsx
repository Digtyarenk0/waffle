import Big from 'big.js';
import classNames from 'classnames';
import { useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { HiWallet } from 'react-icons/hi2';
import { useSearchParams } from 'react-router-dom';

import { routes } from 'shared/constants/routes';
import { ButtonPastFromBuffer } from 'shared/ui/button-buffer/ui';
import { Input } from 'shared/ui/input';
import { maxDecimalsInput } from 'shared/ui/input/model/helper/validators/number';
import { amountToWei, weiToAmount } from 'shared/utils/amount';

import { useTypedSelector } from 'entities/store/model/useStore';
import { useERC20Contract } from 'entities/web3/model/hooks/useContract';
import { useSingleSendMethod } from 'entities/web3/model/hooks/useContractSend';

const isTxLoading = false;

interface Form {
  amount: string;
  address: string;
}
export const SendTokenTo = () => {
  const [searchParams] = useSearchParams();
  const tokens = useTypedSelector((s) => s.tokens.tokens || []);
  const paramSendToken = useMemo(() => searchParams.get(routes.send_token), [searchParams]);
  const sendToken = useMemo(() => tokens.find((t) => t.address === paramSendToken), [tokens, paramSendToken]);

  const tokenContract = useERC20Contract(sendToken?.address);
  const sendERC20Token = useSingleSendMethod(tokenContract, 'transfer');

  const {
    handleSubmit,
    register,
    setValue,
    reset,
    trigger,
    watch,
    formState: { errors, isValid, isDirty },
  } = useForm<Form>({
    mode: 'all',
  });

  const [address, amount] = watch(['address', 'amount']);

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

    const transferAmount = amountToWei(amount, sendToken.decimals).toString();
    await sendERC20Token(address, transferAmount);
  };

  return (
    <div className="container mx-auto h-full overflow-y-scroll p-4 flex flex-col justify-between">
      <div>
        <p className="text-2xl text-center mb-4 mt-5">Send {symbol}</p>
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
        </div>
      </div>
      <div className="mb-10">
        <button
          className={classNames(
            'w-full h-10 rounded-2xl mt-2',
            !(!isValid || isTxLoading) ? 'text-black-theme font-semibold bg-green-main' : 'bg-gray-main',
          )}
          disabled={!isValid || isTxLoading}
          onClick={handleTransferToken}
          type="submit"
        >
          {isTxLoading ? 'Processing' : 'Send'}
        </button>
      </div>
    </div>
  );
};
