import classNames from 'classnames';
import { useMemo } from 'react';

import { useClipboard } from 'shared/hooks/useClipboard';
import { truncateMiddle } from 'shared/utils/text';

import { useTypedSelector } from 'entities/store/model/useStore';

export const Header = () => {
  const wallet = useTypedSelector((s) => s.wallet);

  const address = useMemo(() => wallet?.address || '...', [wallet?.address]);
  const balance = useMemo(
    () => (wallet.balance ? Number(wallet.balance).toFixed(4).toString() : '-'),
    [wallet.balance],
  );
  const clipboard = useClipboard(address);

  return (
    <div className="mt-5 ml-5 grid grid-cols-2 grid-rows-1">
      <div className="text-start">
        <p className="text-sm">Balance:</p>
        <p className="text-base">{`${balance} MATIC`}</p>
      </div>
      <button className="text-start hover:text-green-main" onClick={clipboard.copy}>
        <p className="text-sm ">Wallet:</p>
        <p className={classNames('text-base', clipboard.isCopied && 'text-green-main')}>
          {clipboard.isCopied ? 'Copied' : truncateMiddle(address, 8, 5)}
        </p>
      </button>
    </div>
  );
};
