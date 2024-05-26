import { IoIosSend } from 'react-icons/io';
import { LuMoreVertical } from 'react-icons/lu';
import { MdOutlineCallReceived, MdOutlineSwapCalls } from 'react-icons/md';
import { TbProgressHelp } from 'react-icons/tb';

import { routes } from 'shared/constants/routes';
import { ButtonRound } from 'shared/ui/button-round';

import { Header } from 'widgets/header';

export const HomePage = () => {
  return (
    <div className="w-full h-full">
      <Header />
      <div className="grid grid-cols-4 grid-rows-1 mt-3">
        <ButtonRound
          ico={<IoIosSend size="25px" className="absolute -mb-[0.5px] -ml-[0.5px]" />}
          route={routes.send}
          text="Send"
        />
        {/* <ButtonRound route="" ico={<TbProgressHelp size="25px" />} className="text-white-main" text="-" /> */}
        <ButtonRound ico={<TbProgressHelp size="25px" />} route="" text="" />
        <ButtonRound ico={<TbProgressHelp size="25px" />} route="" text="" />
        <ButtonRound ico={<TbProgressHelp size="25px" />} route="" text="" />
        {/* <ButtonRound ico={<MdOutlineCallReceived size="25px" />} route="" text="Recive" />
        <ButtonRound ico={<MdOutlineSwapCalls size="25px" />} route="" text="Swap" />
        <ButtonRound ico={<LuMoreVertical size="25px" />} route="" text="More" /> */}
      </div>
      <div className="mt-6 border-t-2 border-gray-main" />
    </div>
  );
};
