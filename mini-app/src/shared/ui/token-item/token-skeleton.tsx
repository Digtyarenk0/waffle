import cs from 'classnames';
import { memo } from 'react';

const load = 'bg-gray-main/50 animate-pulse';

export const TokenListItemSkeleton = memo(() => {
  return (
    <button className="flex items-center w-full">
      <div className="relative">
        <div className={cs(load, 'w-8 h-8 m-1 mr-3 rounded-full')} />
      </div>
      <div className="flex justify-between w-full">
        <div className="text-start">
          <div className={cs(load, 'rounded-md w-7 h-3 mb-1')} />
          <div className={cs(load, 'rounded-md w-9 h-3')} />
        </div>
        <div className="flex flex-col items-end">
          <div className={cs(load, 'rounded-md w-12 h-3 mb-1')} />
          <div className={cs(load, 'rounded-md w-10 h-3')} />
        </div>
      </div>
    </button>
  );
});
