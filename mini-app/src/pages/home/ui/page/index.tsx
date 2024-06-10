import { useHapticFeedback } from '@vkruglikov/react-telegram-web-app';
import { useCallback } from 'react';
import { IoIosArrowDown, IoIosMore } from 'react-icons/io';
import { TbHistory } from 'react-icons/tb';
import { useNavigate } from 'react-router-dom';

import { ICONS_UI } from 'shared/constants/icons';
import { routes } from 'shared/constants/routes';
import { useClipboard } from 'shared/hooks/useClipboard';
import useDebounce from 'shared/hooks/useDebounce';
import { TokenListItemSkeleton } from 'shared/ui/token-item/token-skeleton';

import { useTypedSelector } from 'entities/store/model/useStore';
import { useWalletApp } from 'entities/wallet/model/context';

import { TokenList } from 'widgets/token-list/ui';

export const HomePage = () => {
  const navigate = useNavigate();
  const [impactOccurred] = useHapticFeedback();

  const tokens = useTypedSelector((s) => s.tokens.tokens);

  const { account } = useWalletApp();

  const clipboard = useClipboard(account);

  // const impact = useCallback(() => impactOccurred('heavy'), [impactOccurred]);
  const toPage = useCallback(
    (path: string) => {
      impactOccurred('heavy');
      navigate(path);
    },
    [impactOccurred, navigate],
  );
  const copy = useCallback(() => {
    impactOccurred('heavy');
    clipboard.copy();
  }, [clipboard, impactOccurred]);
  const scan = useCallback(() => {
    impactOccurred('heavy');
  }, [impactOccurred]);

  const tokensDeb = useDebounce(tokens, 750).value;

  return (
    <div className="">
      <div className="flex flex-col bg-black-theme">
        <div className="flex justify-between items-center relative h-24 px-8">
          <img src={ICONS_UI.waffle} alt="" className="absolute -left-0 w-[116px]" />
          <p className="font-bold text-2xl">$376.86</p>
          <div className="flex flex-col">
            <button onClick={scan}>
              <img src={ICONS_UI.scan} alt="" className="w-5 mb-4" />
            </button>
            <button onClick={copy}>
              <img src={ICONS_UI.copy} alt="" className="w-5" />
            </button>
          </div>
        </div>
        <div className="bg-white-main rounded-t-3xl">
          <div className="grid grid-cols-4 h-16 px-5 pt-2 pb-[65px] border-b-[0.5px] border-b-gray-light">
            <button className="flex flex-col justify-center items-center" onClick={() => toPage(routes.select_token)}>
              <IoIosArrowDown color="#6b6b6b" className="w-10 h-10 p-2 rounded-full bg-yellow-main rotate-180" />
              <p className="text-gray-main">Send</p>
            </button>
            <button className="flex flex-col justify-center items-center" onClick={() => toPage(routes.receive)}>
              <IoIosArrowDown color="#6b6b6b" className="w-10 h-10 p-2 pb-1 rounded-full bg-yellow-main" />
              <p className="text-gray-main">Receive</p>
            </button>
            <button className="flex flex-col justify-center items-center" onClick={() => toPage(routes.main)}>
              <TbHistory color="#6b6b6b" className="w-10 h-10 p-3 rounded-full bg-yellow-main" />
              <p className="text-gray-main">History</p>
            </button>
            <button className="flex flex-col justify-center items-center" onClick={() => toPage(routes.main)}>
              <IoIosMore color="#6b6b6b" className="w-10 h-10 p-2 rounded-full bg-yellow-main" />
              <p className="text-gray-main">More</p>
            </button>
          </div>
          <div className="mt-2 px-4 h-[calc(100vh_-_230px)] overflow-scroll">
            {tokensDeb ? <TokenList tokens={tokensDeb.concat(tokensDeb)} /> : <TokenListItemSkeleton />}
          </div>
        </div>
      </div>
    </div>
  );
};
