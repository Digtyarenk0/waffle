import { useMemo } from 'react';
import { IoIosSend } from 'react-icons/io';
// import { LuMoreVertical } from 'react-icons/lu';
import { MdOutlineCallReceived } from 'react-icons/md';
import { TbProgressHelp } from 'react-icons/tb';

import { routes } from 'shared/constants/routes';
import { ButtonRound } from 'shared/ui/button-round';

import { useTypedSelector } from 'entities/store/model/useStore';

import { Header } from 'widgets/header';

import { HomeTokenItem } from '../token-item';

export const HomePage = () => {
  const tokensWithBalance = useTypedSelector((s) => s.tokens.tokens);

  const tokens = useMemo(() => {
    return tokensWithBalance?.map((t) => <HomeTokenItem {...t} key={t.address} />);
  }, [tokensWithBalance]);

  return (
    <div className="flex flex-col h-screen w-screen justify-between overflow-clip">
      <div className="h-36">
        <Header />
        <div className="grid grid-cols-4 grid-rows-1 mt-3">
          <ButtonRound
            ico={<IoIosSend size="25px" className="absolute -mb-[0.5px] -ml-[0.5px]" />}
            route={routes.send}
            text="Send"
          />
          <ButtonRound ico={<MdOutlineCallReceived size="25px" />} route={routes.receive} text="Recive" />
          <ButtonRound ico={<TbProgressHelp size="25px" />} route="" text="" />
          <ButtonRound ico={<TbProgressHelp size="25px" />} route="" text="" />
          {/* <ButtonRound ico={<MdOutlineCallReceived size="25px" />} route="" text="Recive" />
        <ButtonRound ico={<MdOutlineSwapCalls size="25px" />} route="" text="Swap" />
        <ButtonRound ico={<LuMoreVertical size="25px" />} route="" text="More" /> */}
        </div>
      </div>
      <div className="mt-6 pl-4 bg-slate-900 max-h-fit overflow-scroll">{tokens}</div>
    </div>
  );
};
