import classNames from 'classnames';
import { ReactElement } from 'react';
import { HiWallet } from 'react-icons/hi2';
import { TbProgressHelp } from 'react-icons/tb';
import { NavLink } from 'react-router-dom';

import { routes } from 'shared/constants/routes';

interface FooterBtnProps {
  ico: ReactElement;
  text: string;
  route: string;
  className?: string;
}

const style = 'p-2 text-center font-medium transition-all border-t-[1px] border-gray-main';

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
  return (
    <div className="grid grid-cols-3 grid-rows-1 w-full">
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
