import classNames from 'classnames';
import { ReactElement, useEffect } from 'react';
import { HiWallet } from 'react-icons/hi2';
import { TbProgressHelp } from 'react-icons/tb';
import { NavLink } from 'react-router-dom';

import { routes } from 'shared/constants/routes';
import { weiToAmount } from 'shared/utils/amount';

import { useTypedDispatch, useTypedSelector } from 'entities/store/model/useStore';
import { useInitWallet } from 'entities/wallet/model/hooks/useInitWalletApp';
import { updateBalance } from 'entities/wallet/model/store';

interface FooterBtnProps {
  ico: ReactElement;
  text: string;
  route: string;
  className?: string;
}

const style = 'p-3 text-center font-semibold transition-all border-t-2 border-gray-main';

const FooterBtn = ({ text, ico, route, className }: FooterBtnProps) => (
  <NavLink
    to={route}
    className={({ isActive }) => {
      const activeStyle = isActive ? 'text-green-main' : '';
      return classNames(style, activeStyle, className);
    }}
  >
    <div>{ico}</div>
    {text}
  </NavLink>
);

export const Footer = () => {
  const wallet = useTypedSelector((s) => s.wallet);
  const dispatch = useTypedDispatch();

  useInitWallet();

  useEffect(() => {
    if (wallet.provider && wallet.address) {
      wallet.provider
        ?.getBalance(wallet.address)
        .then((i) => dispatch(updateBalance(weiToAmount(i.toString(), 18).toString())));
    }
  }, [wallet.address]);

  return (
    <div className="grid grid-cols-3 grid-rows-1 w-full absolute bottom-0">
      <FooterBtn
        route={routes.main}
        ico={<HiWallet size="25px" className="mx-auto text-green-main" />}
        text="Home"
        className="text-green-main"
      />
      <FooterBtn
        route=""
        ico={<TbProgressHelp size="25px" className="mx-auto text-white-main" />}
        className="text-white-main "
        text="-"
      />
      <FooterBtn
        route=""
        ico={<TbProgressHelp size="25px" className="mx-auto text-white-main" />}
        className="text-white-main "
        text="-"
      />
    </div>
  );
};
