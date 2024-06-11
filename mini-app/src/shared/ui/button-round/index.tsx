import { ButtonHTMLAttributes, ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';

interface FooterBtnProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  ico: ReactElement;
  route: string;
  text: string;
}
export const ButtonRound = ({ text, route, ico, ...otherProps }: FooterBtnProps) => {
  const navigate = useNavigate();

  return (
    <button className="m-2 p-3 relative transition-all " onClick={() => navigate(route)} {...otherProps}>
      <div className="w-11 h-11 flex items-center justify-center border-2 rounded-full border-gray-main">{ico}</div>
      <p className="absolute pl-1 pt-1 text-white-main text-sm font-boldsf text-center">{text}</p>
    </button>
  );
};
