import { IoIosSend } from 'react-icons/io';
import { MdOutlineCallReceived } from 'react-icons/md';
import { TbProgressHelp } from 'react-icons/tb';

import { routes } from 'shared/constants/routes';
import useDebounce from 'shared/hooks/useDebounce';
import { ButtonRound } from 'shared/ui/button-round';
import { Loader } from 'shared/ui/loader';

import { useTypedSelector } from 'entities/store/model/useStore';

import { Header } from 'widgets/header';
import { TokenList } from 'widgets/token-list/ui';

export const HomePage = () => {
  const tokens = useTypedSelector((s) => s.tokens.tokens);

  const tokensDeb = useDebounce(tokens, 750).value;

  return (
    <div className="h-full overflow-y-scroll">
      <div className="h-40">
        <Header />
        <div className="flex justify-around mt-3">
          <ButtonRound
            ico={<IoIosSend size="25px" className="absolute -mb-[0.5px] -ml-[0.5px]" />}
            route={routes.select_token}
            text="Send"
          />
          <ButtonRound ico={<MdOutlineCallReceived size="25px" />} route={routes.receive} text="Recive" />
          <ButtonRound ico={<TbProgressHelp size="25px" />} route="" text="" />
          <ButtonRound ico={<TbProgressHelp size="25px" />} route="" text="" />
        </div>
      </div>
      <div className="mt-2 px-4">{tokensDeb ? <TokenList tokens={tokensDeb} /> : <Loader className="mt-16" />}</div>
    </div>
  );
};
