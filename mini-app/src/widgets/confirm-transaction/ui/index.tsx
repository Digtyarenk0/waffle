import { TransactionRequest, TransactionResponse } from '@ethersproject/providers';
import Big from 'big.js';
import classNames from 'classnames';
import { Deferrable } from 'ethers/lib/utils';
import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { CHAIN_INFO } from 'shared/constants/chain';
import { ICONS_CHAINS } from 'shared/constants/icons';
import { routes } from 'shared/constants/routes';
import { weiToAmount } from 'shared/utils/amount';
import { truncateMiddle } from 'shared/utils/text';

import { useTypedSelector } from 'entities/store/model/useStore';

import { IToken } from 'features/tokens/model/store';

import { useModalContext } from 'widgets/modal/model/provider';

interface Transaction {
  dataTx: Deferrable<TransactionRequest>;
  send: () => Promise<TransactionResponse>;
}

// interface ConfirmTransactionProps<C extends Contract, M extends ContractMethodsType<C>> {
interface ConfirmTransactionProps {
  transaction: Transaction;
  asset: IToken;
  from: string;
  to: string;
  amount: string;
  cost: string;
}

export const ConfirmTransactionTransfer = (props: ConfirmTransactionProps) => {
  const { transaction, asset, from, to, amount, cost } = props;

  const price = useTypedSelector((s) => s.tokens.prices?.[CHAIN_INFO[asset.chainId].nativeCurrency.symbol]);

  const navigate = useNavigate();
  const { closeModal } = useModalContext();

  const confirm = useCallback(() => {
    transaction.send();
    closeModal();
    navigate(routes.main);
  }, [transaction, closeModal, navigate]);

  const fee = useMemo(() => {
    return weiToAmount(transaction.dataTx?.gasLimit?.toString() || 0, 10).toFixed(6);
  }, [transaction.dataTx?.gasLimit]);

  const maxTotal = useMemo(() => {
    return Big(cost)
      .add(Big(fee).mul(price || 1))
      .toFixed(6);
  }, [cost, fee, price]);

  return (
    <div className="container mx-auto min-h-[80vh] overflow-y-scroll p-4 flex flex-col">
      <p className="text-2xl text-center mb-4 mt-5">Transfer</p>
      <div className="mt-4">
        <p className="text-xl text-purple-main text-center mb-1">-{amount} ETH</p>
        <p className="text-md text-center">{`~ ${cost} $`}</p>
      </div>
      <div className="mt-6 bg-yellow-main/50 w-full p-4 rounded-lg">
        <div className="flex justify-between">
          <p className="text-gray-main">Asset</p>
          <div className="relative flex">
            <img src={ICONS_CHAINS[asset.chainId]} alt="" className="w-4 pr-1" />
            <p className="text-gray-main">{asset.symbol}</p>
          </div>
        </div>
        <div className="flex justify-between py-2">
          <p className="text-gray-main">Wallet</p>
          <p className="text-gray-main">{truncateMiddle(from, 7, 7)}</p>
        </div>
        <div className="flex justify-between">
          <p className="text-gray-main">To</p>
          <p className="text-gray-main">{truncateMiddle(to, 7, 7)}</p>
        </div>
      </div>
      <div className="mt-6 bg-yellow-main/50 w-full p-4 rounded-lg">
        <div className="flex justify-between py-2">
          <p className="text-gray-main">Network fee</p>
          <p className="text-gray-main">{`${fee} ${CHAIN_INFO[asset.chainId].nativeCurrency.symbol}`}</p>
        </div>
        <div className="flex justify-between">
          <p className="text-gray-main">Max Total</p>
          <p className="text-gray-main">{`${maxTotal} $`}</p>
        </div>
      </div>
      <div className="mb-10">
        <button
          className={classNames(
            'w-full h-10 rounded-xl mt-8 flex items-center justify-center text-white-main font-semibold bg-coral-main',
          )}
          onClick={confirm}
          type="submit"
        >
          Confirm
        </button>
      </div>
    </div>
  );
};
