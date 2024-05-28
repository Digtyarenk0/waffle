import React, { EffectCallback, useEffect, useMemo, useRef } from 'react';

type Destructor = () => void;
type CallbackResult = void | Destructor;

// Synchronous version of useEffect.
// It is still in the testing phase and may not be stable.
// Also, useMemo is not a very stable option, since React can call it at any time, regardless of dependencies
export const useSyncEffect = (callback: EffectCallback, deps: React.DependencyList | undefined) => {
  const ref = useRef<CallbackResult>(undefined);

  useMemo(
    () => {
      if (ref.current) {
        ref.current();
      }
      ref.current = callback();
    },
    deps as [],
  );

  // Call the last callback after component unmount
  useEffect(() => {
    return () => {
      if (ref.current) {
        ref.current();
      }
    };
  }, []);
};
