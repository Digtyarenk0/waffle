import classNames from 'classnames';

import { useClipboard } from 'shared/hooks/useClipboard';
import { truncateMiddle } from 'shared/utils/text';

interface TransactionInfoBlock {
  hash?: string;
  gasUsed?: string;
}

export const TransactionInfoBlock = (props: TransactionInfoBlock) => {
  const { hash, gasUsed } = props;

  const clipboard = useClipboard(hash || '');

  if (!hash || !gasUsed) return <></>;

  return (
    <div className="p-3 border-[1px] rounded-md mt-4">
      <p>Transaction</p>
      <div className="px-2">
        {hash && (
          <button type="button" className="text-left" onClick={clipboard.copy}>
            <p className="text-sm ">Hash:</p>
            <p className={classNames('text-base text-green-main')}>
              {clipboard.isCopied ? 'Copied' : truncateMiddle(hash, 12, 20)}
            </p>
          </button>
        )}
        {gasUsed && (
          <div className="mt-2 text-left">
            <p className="text-sm ">Fee:</p>
            <div className="flex">
              <p className={classNames('text-base text-green-main')}>{gasUsed}</p>
              <p className={classNames('text-base pl-1')}>MATIC</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
