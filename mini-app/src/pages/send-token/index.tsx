import { BigNumber } from '@ethersproject/bignumber';
import classNames from 'classnames';
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';

import { TransactionInfoBlock } from 'shared/ui/transaction-info';
import { amountToWei, weiToAmount } from 'shared/utils/amount';

import { useWalletApp } from 'entities/wallet/model/context';
import { useNativBalance } from 'entities/wallet/model/hooks/useBalance';

import { Header } from 'widgets/header';

type Inputs = {
  address: string;
  amount: number;
};

interface TxData {
  gasUsed: string;
  hash: string;
}

export const SendToken = () => {
  const wallet = useWalletApp();
  const nativBalance = useNativBalance();

  const [txData, setTxData] = useState<TxData>();
  const [isTxLoading, setTxLoading] = useState(false);
  const [txErr, setTxErr] = useState<any>();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<Inputs>({ reValidateMode: 'onChange' });

  const onSubmit = useCallback(
    async (data: Inputs) => {
      const { address, amount } = data;
      if (!wallet.wallet) return;
      try {
        setTxData(undefined);
        setTxLoading(true);
        const value = amountToWei(amount, 18).toString();
        const tx = await wallet.wallet.sendTransaction?.({
          to: address,
          value,
        });
        const receipt = await tx?.wait();
        if (receipt) {
          const gasUsed = receipt.gasUsed;
          // @ts-ignore
          const gasPrice = receipt?.gasPrice || '0';
          const totalGasCost = BigNumber.from(gasUsed).mul(gasPrice);
          setTxData({
            hash: tx.hash,
            gasUsed: weiToAmount(totalGasCost, 18).toString(),
          });
        }
        setTxLoading(false);
      } catch (error: any) {
        if (error?.code === 'INSUFFICIENT_FUNDS') {
          setTxErr('Insufficient balance to pay the fee');
        } else {
          setTxErr(error?.code);
        }
      }
      setTxLoading(false);
    },
    [wallet.wallet],
  );

  return (
    <div className="w-full h-full">
      <Header />
      <div className="mt-6 border-t-2 border-gray-main" />
      <form className="px-3" onSubmit={handleSubmit(onSubmit)}>
        <div className="h-[58vh] overflow-scroll">
          <div className="mt-4">
            <p className="text-gray-main font-semibold mb-2">Address of the recipient:</p>
            <input
              className="p-2 text-xs text-white-main h-8 w-[330px] bg-transparent autofill:!bg-transparent border-[1px] rounded-sm border-gray-main"
              {...register('address', { minLength: 42, maxLength: 42, required: true })}
            />
          </div>
          <div className="mt-4">
            <p className="text-gray-main font-semibold mb-2">Sending MATIC:</p>
            <input
              className="p-2 text-xs text-white-main h-8 w-[330px] bg-transparent autofill:!bg-transparent border-[1px] rounded-sm border-gray-main"
              {...register('amount', { max: Number(nativBalance || 0), min: 0.0001, required: true })}
            />
          </div>
          <TransactionInfoBlock hash={txData?.hash} gasUsed={txData?.gasUsed} />
          {errors.address && <p>{errors.address.message}</p>}
          {txErr && <p className="text-red-500 mt-2 pl-3">{txErr.toString()}</p>}
        </div>
        <button
          className={classNames(
            'w-full h-10 rounded-2xl mt-2',
            !(!isValid || isTxLoading) ? 'text-black-theme font-semibold bg-green-main' : 'bg-gray-main',
          )}
          disabled={!isValid || isTxLoading}
          type="submit"
        >
          {isTxLoading ? 'Processing' : 'Send'}
        </button>
      </form>
    </div>
  );
};
