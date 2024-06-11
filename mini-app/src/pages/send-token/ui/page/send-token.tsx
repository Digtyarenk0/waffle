import Big from 'big.js';
import classNames from 'classnames';
import { useCallback, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { HiWallet } from 'react-icons/hi2';
import { useNavigate } from 'react-router-dom';

import { CHAIN_INFO } from 'shared/constants/chain';
import { routes } from 'shared/constants/routes';
import { ButtonPastFromBuffer } from 'shared/ui/button-buffer/ui';
import { Input } from 'shared/ui/input';
import { TokenListItem } from 'shared/ui/token-item';
import { amountToWei, weiToAmount } from 'shared/utils/amount';

import { useTypedSelector } from 'entities/store/model/useStore';
import { useWalletApp } from 'entities/wallet/model/context';
import { useERC20Contract } from 'entities/web3/model/hooks/useContract';
import { useContractEstimatedGas } from 'entities/web3/model/hooks/useContractEstimatedGas';
import { useSingleSendMethod } from 'entities/web3/model/hooks/useContractSend';
import { TransactionState } from 'entities/web3/model/types/contracts';

import { IToken } from 'features/tokens/model/store';

import { ConfirmTransactionTransfer } from 'widgets/confirm-transaction/ui';
import { useModalContext } from 'widgets/modal/model/provider';

import { onChangeAddress, onChangeAmount } from 'pages/send-token/model/helper';

interface Form {
  amount: string;
  address: string;
}
interface SendTokenToProps {
  token: IToken;
}

export const SendTokenTo = (props: SendTokenToProps) => {
  const { token: sendToken } = props;

  const price = useTypedSelector((s) => s.tokens.prices?.[sendToken.symbol]);

  const navigate = useNavigate();
  const { account } = useWalletApp();
  const { setModalData } = useModalContext();

  const tokenContract = useERC20Contract(sendToken.address, sendToken.chainId);
  const transferToken = useSingleSendMethod(tokenContract, 'transfer');

  const [txLoading, setTxLoading] = useState<boolean>(false);
  const [txResult, setTxResult] = useState<TransactionState>();

  const {
    register,
    setValue,
    setError,
    clearErrors,
    trigger,
    watch,
    formState: { errors, isValid },
  } = useForm<Form>({
    defaultValues: {
      address: account,
      amount: '0.001',
    },
  });

  const [address, amount] = watch(['address', 'amount']);

  const estimatedGas = useContractEstimatedGas(tokenContract, 'transfer', [account, 1], {
    depBlock: false,
    disabled: !account || !tokenContract || !sendToken,
  });

  const symbol = useMemo(() => sendToken?.symbol || '', [sendToken?.symbol]);
  const balance = useMemo(
    () => weiToAmount(sendToken?.balanceWei || 0, sendToken?.decimals || 18).toFixed(4),
    [sendToken?.balanceWei, sendToken?.decimals],
  );
  const disabled = useMemo(
    () => !isValid || txLoading || !!errors?.address || !!errors?.amount,
    [errors?.address, errors?.amount, isValid, txLoading],
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

  const handleTransferToken = async () => {
    if (!sendToken?.address || !address || !amount || !tokenContract) return;
    setTxLoading(true);
    setTxResult(undefined);
    const transferAmount = amountToWei(amount, sendToken.decimals).toString();
    const cost = Big(amount)
      .mul(price || 0)
      .toString();
    try {
      const txData = await transferToken(address, transferAmount);
      console.log('txData:', txData);
      if (txData.tx) {
        setModalData({
          children: (
            <ConfirmTransactionTransfer
              transaction={txData.tx}
              asset={sendToken}
              from={account}
              to={address}
              amount={amount}
              cost={cost}
            />
          ),
        });
      }
      // setTxResult(txData);
    } catch (error: any) {
      console.log({ error });
    } finally {
      setTxLoading(false);
      // setValue('address', '');
      // setValue('amount', '');
      // trigger(['address', 'amount']);
    }
  };

  return (
    <div className="container mx-auto min-h-[80vh] overflow-y-scroll p-4  flex flex-col justify-between">
      <div>
        <p className="text-2xl text-center mb-4 mt-5">Send {symbol}</p>
        <div className="px-4 pb-2 pt-1 bg-yellow-main rounded-2xl">
          {sendToken && (
            <div className="mt-8 mb-4">
              <TokenListItem token={sendToken} onClick={() => navigate(routes.select_token)} />
            </div>
          )}
          <div>
            <p className="font-medium text-gray-main">Address or domain</p>
            <div className="relative">
              <Input
                classNameInput="w-full p-2 pl-4 pr-14 text-sm"
                register={register('address', {
                  onChange: (e) => onChangeAddress({ e, setError, clearErrors }),
                  required: true,
                })}
                errors={errors}
                type="text"
                placeholder={`Search or Enter`}
                example={``}
              />
              <ButtonPastFromBuffer
                className="absolute top-2 right-4 font-boldsf text-green-main"
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
                  required: true,
                  onChange: (e) => onChangeAmount({ e, balance }),
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
              fee: ~{weiToAmount(estimatedGas || 0, 10).toString()}{' '}
              {CHAIN_INFO[sendToken.chainId].nativeCurrency.symbol}
            </p>
          </div>
          {/* // Data */}
          <div className="mt-8">
            <p className="text-red-500">{txResult?.error}</p>
            {/* <TransactionInfoBlock
              hash={txResult?.result?.transactionHash}
              gasUsed={txResult?.result?.gasUsed.toString()}
              chainId={sendToken?.chainId}
            /> */}
          </div>
        </div>
      </div>
      <div className="mb-10">
        <button
          className={classNames(
            'w-full h-10 rounded-2xl mt-3 flex items-center justify-center text-white-main',
            !disabled ? ' font-semibold bg-coral-main' : 'bg-gray-light ',
          )}
          disabled={disabled}
          onClick={handleTransferToken}
          type="submit"
        >
          {txLoading ? 'Preparing' : 'Send'}
        </button>
      </div>
    </div>
  );
};
