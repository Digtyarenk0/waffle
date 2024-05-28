import { useMemo } from 'react';
import { IoIosSend } from 'react-icons/io';
// import { LuMoreVertical } from 'react-icons/lu';
// import { MdOutlineCallReceived, MdOutlineSwapCalls } from 'react-icons/md';
import { TbProgressHelp } from 'react-icons/tb';

import { routes } from 'shared/constants/routes';
import { ButtonRound } from 'shared/ui/button-round';
import { weiToAmount } from 'shared/utils/amount';

import { useTokensBalance } from 'entities/web3/model/hooks/tokens/useTokensBalance';

import { Header } from 'widgets/header';

interface TokenItem {
  name?: string;
  symbol?: string;
  logoURI?: string;
  balance?: string;
}

const TokenItem = (props: TokenItem) => (
  <div className="flex items-center">
    <img className="w-7 h-7 m-1 mr-3" src={props.logoURI} alt="" />
    <div>
      <p>{props.name}</p>
      <p>{`${props.balance} ${props.symbol}`}</p>
    </div>
  </div>
);

export const HomePage = () => {
  const tokensWithBalance = useTokensBalance();
  console.log({ tokensWithBalance });

  const tokens = useMemo(() => {
    return tokensWithBalance?.map((t) => (
      <TokenItem
        name={t.name}
        symbol={t.symbol}
        balance={weiToAmount(t.balanceWei, t.decimals || 18).toString()}
        logoURI={t.logoURI}
        key={t.address}
      />
    ));
  }, [tokensWithBalance]);

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
      <div className="mt-6 pl-4 bg-slate-900 max-h-[60vh] overflow-x-scroll">{tokens}</div>
    </div>
  );
};
