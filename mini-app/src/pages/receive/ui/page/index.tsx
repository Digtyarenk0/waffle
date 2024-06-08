import { Space } from 'antd';
import QRCode from 'antd/es/qr-code';
import classNames from 'classnames';
import { FaCheck } from 'react-icons/fa6';
import { IoCopyOutline } from 'react-icons/io5';

import { useClipboard } from 'shared/hooks/useClipboard';

import { useWalletApp } from 'entities/wallet/model/context';

export const ReceivePage = () => {
  const { account = '' } = useWalletApp();

  const clipboard = useClipboard(account, 700);

  return (
    <div className="flex flex-col h-[80vh] justify-center items-center overflow-clip">
      <p className="mb-6 font-semibold text-xl">Receive assets in EVM:</p>
      <Space direction="vertical" align="center">
        <QRCode className="!bg-white-main" color="#000" value={account} />
      </Space>
      <p className="pt-5 break-words max-w-[85vw] text-center">{account}</p>
      <button
        className={classNames(
          'flex justify-center items-center mt-6 p-3 w-48 rounded-md text-start',
          clipboard.isCopied ? 'bg-green-900' : 'bg-gray-main',
        )}
        onClick={clipboard.copy}
      >
        {clipboard.isCopied ? (
          <>
            <FaCheck className="mr-3" />
            <p>Copied</p>
          </>
        ) : (
          <>
            <IoCopyOutline className="mr-3" />
            <p>Copy address</p>
          </>
        )}
      </button>
    </div>
  );
};
