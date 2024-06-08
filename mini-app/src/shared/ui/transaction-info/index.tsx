import classNames from 'classnames';

import { CHAIN_INFO } from 'shared/constants/chain';
import { weiToAmount } from 'shared/utils/amount';
import { truncateMiddle } from 'shared/utils/text';

import { DEFAULT_CHAIN_ID, SupportedChainId } from 'entities/wallet/model/types/chain';

interface TransactionInfoBlock {
  hash?: string;
  gasUsed?: string;
  chainId?: SupportedChainId;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const TransactionInfoBlock = (props: TransactionInfoBlock) => {
  const { hash, gasUsed, chainId = DEFAULT_CHAIN_ID } = props;

  const txLink = `${CHAIN_INFO[chainId].explorer[0]}tx/${hash}`;

  if (!hash || !gasUsed) return <></>;

  return (
    <div className="p-3 border-[1px] border-gray-500 rounded-md mt-4">
      <p>Transaction</p>
      <div className="px-2">
        {hash && (
          <div className="text-left">
            <p className="text-sm ">Hash:</p>
            <div className="flex">
              <p className={classNames('text-base text-white-main')}>{truncateMiddle(hash, 12, 20)}</p>
              <a href={txLink} target="_blank" rel="noopener noreferrer" className="text-base text-green-main ml-4">
                View
              </a>
            </div>
          </div>
        )}
        {gasUsed && (
          <div className="mt-2 text-left">
            <p className="text-sm ">Fee:</p>
            <div className="flex">
              <p className={classNames('text-base text-green-main')}>{weiToAmount(gasUsed, 10).toString()}</p>
              <p className={classNames('text-base pl-1')}>{CHAIN_INFO[chainId].nativeCurrency.symbol}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
