import { useHapticFeedback } from '@vkruglikov/react-telegram-web-app';
import { useCallback } from 'react';
import { NavLink } from 'react-router-dom';

import { ICONS_UI } from 'shared/constants/icons';
import { routes } from 'shared/constants/routes';

import { useModalContext } from 'widgets/modal/model/provider';

export const Footer = () => {
  const [impactOccurred] = useHapticFeedback();
  const { closeModal } = useModalContext();

  const impact = useCallback(() => {
    impactOccurred('heavy');
    closeModal();
  }, [closeModal, impactOccurred]);

  return (
    <div className="h-[70px] bg-white-main border-t-[0.5px] fixed z-50 bottom-0 w-full grid grid-cols-3 px-2 pb-6 border-t-gray-light">
      <NavLink to={routes.main} onClick={impact} className="flex flex-col justify-center items-center">
        <img src={ICONS_UI.swap} className="w-8" alt="" />
        <p className="text-gray-main text-sm">Swap</p>
      </NavLink>
      <NavLink to={routes.main} className="flex flex-col justify-center items-center relative" onClick={impact}>
        <img src={ICONS_UI.home} className="w-[50px] p-[10px] absolute -top-6 rounded-full bg-coral-main" alt="" />
        <p className="text-gray-main text-sm mt-8">Home</p>
      </NavLink>
      <NavLink to={routes.main} onClick={impact} className="flex flex-col justify-center items-center">
        <img src={ICONS_UI.stake} className="w-7" alt="" />
        <p className="text-gray-main text-sm">Stake</p>
      </NavLink>
    </div>
  );
};
