import useDebounce from 'shared/hooks/useDebounce';
import { TokenListItemSkeleton } from 'shared/ui/token-item/token-skeleton';

import { useTypedSelector } from 'entities/store/model/useStore';

import { TokenList } from 'widgets/token-list/ui';

import { HomeHeader } from '../header';
import { HomeNavigator } from '../navigator';

export const HomePage = () => {
  const tokens = useTypedSelector((s) => s.tokens.tokens);
  const tokensDeb = useDebounce(tokens, 750).value;

  return (
    <div className="flex flex-col bg-black-theme">
      <HomeHeader />
      <div className="bg-white-main rounded-t-3xl">
        <HomeNavigator />
        <div className="mt-2 px-4 h-[calc(100vh_-_230px)] overflow-scroll">
          {tokensDeb ? <TokenList tokens={tokensDeb} /> : <TokenListItemSkeleton />}
        </div>
      </div>
    </div>
  );
};
