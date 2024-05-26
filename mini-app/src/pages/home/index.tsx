import classNames from 'classnames';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { IoIosSend } from 'react-icons/io';
import { LuMoreVertical } from 'react-icons/lu';
import { MdOutlineCallReceived, MdOutlineSwapCalls } from 'react-icons/md';

import { ButtonRound } from 'shared/ui/button-round';
import { copyToClipboard } from 'shared/utils/copy-to-clipboard';
import { truncateMiddle } from 'shared/utils/text';

import { useNativBalance } from 'features/wallet/model/hooks/useBalance';
import { useWalletApp } from 'features/wallet/model/hooks/wallet';

const Header = () => {
  const wallet = useWalletApp();
  const balance = useNativBalance(wallet);
  const [isCopied, setIsCopied] = useState(false);

  const address = useMemo(() => wallet?.address || '...', [wallet?.address]);
  const copyAddress = useCallback(() => {
    copyToClipboard(address);
    setIsCopied(true);
  }, [address]);

  useEffect(() => {
    if (isCopied) {
      setTimeout(() => setIsCopied(false), 550);
    }
  }, [isCopied]);

  return (
    <div className="">
      <div className="mt-5 ml-5 grid grid-cols-2 grid-rows-1">
        <div className="text-start">
          <p className="text-sm">Balance:</p>
          <p className="text-base">{`${balance} MATIC`}</p>
        </div>
        <button className="text-start hover:text-green-main" onClick={copyAddress}>
          <p className="text-sm ">Wallet:</p>
          <p className={classNames('text-base', isCopied && 'text-green-main')}>
            {isCopied ? 'Copied' : truncateMiddle(address, 8, 5)}
          </p>
        </button>
      </div>
      <div className="grid grid-cols-4 grid-rows-1 mt-3">
        <ButtonRound
          ico={<IoIosSend size="25px" className="absolute -mb-[0.5px] -ml-[0.5px]" />}
          route=""
          text="Send"
        />
        <ButtonRound ico={<MdOutlineCallReceived size="25px" />} route="" text="Recive" />
        <ButtonRound ico={<MdOutlineSwapCalls size="25px" />} route="" text="Swap" />
        <ButtonRound ico={<LuMoreVertical size="25px" />} route="" text="More" />
      </div>
    </div>
  );
};

export const HomePage = () => {
  return (
    <div className="w-full h-full">
      <Header />
      <div className="mt-6 border-t-2 border-gray-main"></div>
    </div>
  );
};
