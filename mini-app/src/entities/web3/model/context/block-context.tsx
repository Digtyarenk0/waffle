import { Provider } from '@ethersproject/providers';
import retry from 'async-retry';
import React, { useState, useEffect, useCallback, ReactNode } from 'react';

import { RETRY_OPTIONS_HIGH } from 'shared/constants/retry-config';
import { useIsWindowVisible } from 'shared/hooks/useIsWindowVisible';

import { useWalletApp } from 'entities/wallet/model/context';

const BlockContext = React.createContext<number | undefined>(undefined);

export function getBlockNumber(provider: Provider): Promise<number> {
  return retry(() => provider.getBlockNumber(), RETRY_OPTIONS_HIGH);
}

const BlockContextProvider = ({ children }: { children: ReactNode }) => {
  const { chainId: activeChainId, provider } = useWalletApp();
  const isWindowVisible = useIsWindowVisible();

  const [{ chainId, block }, setChainBlock] = useState<{ chainId?: number; block?: number }>({
    chainId: activeChainId,
  });

  const blockNumberCallback = useCallback(
    (block: number) => {
      setChainBlock((chainBlock) => {
        if (chainBlock.chainId === activeChainId) {
          if (!chainBlock.block || chainBlock.block < block) {
            return { chainId: activeChainId, block };
          }
        }
        return chainBlock;
      });
    },
    [activeChainId, setChainBlock],
  );

  useEffect(() => {
    let stale = false;

    if (provider && activeChainId && isWindowVisible) {
      // If chainId hasn't changed, don't clear the block. This prevents re-fetching still valid data.
      setChainBlock((chainBlock) => (chainBlock.chainId === activeChainId ? chainBlock : { chainId: activeChainId }));

      getBlockNumber(provider)
        .then((block) => {
          if (!stale) blockNumberCallback(block);
        })
        .catch((error) => {
          console.error(`Failed to get block number for chainId ${activeChainId}`, error);
        });

      provider.on('block', blockNumberCallback);

      return () => {
        stale = true;
        provider.removeListener('block', blockNumberCallback);
      };
    }

    return void 0;
  }, [activeChainId, provider, blockNumberCallback, setChainBlock, isWindowVisible]);

  return (
    <BlockContext.Provider value={chainId === activeChainId ? block : undefined}>{children}</BlockContext.Provider>
  );
};

export { BlockContext, BlockContextProvider };
