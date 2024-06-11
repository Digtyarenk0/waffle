import { useHapticFeedback } from '@vkruglikov/react-telegram-web-app';
import { useCallback } from 'react';
import { IoIosArrowDown, IoIosMore } from 'react-icons/io';
import { TbHistory } from 'react-icons/tb';
import { useNavigate } from 'react-router-dom';

import { routes } from 'shared/constants/routes';

export const HomeNavigator = () => {
  const navigate = useNavigate();
  const [impactOccurred] = useHapticFeedback();

  const toPage = useCallback(
    (path: string) => {
      impactOccurred('heavy');
      navigate(path);
    },
    [impactOccurred, navigate],
  );

  return (
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
  );
};
