import { useEffect, useState } from 'react';

const VISIBILITY_STATE_SUPPORTED = 'visibilityState' in document;

const isWindowVisible = () => {
  return !VISIBILITY_STATE_SUPPORTED || document.visibilityState !== 'hidden';
};

/**
 * Returns whether the window is currently visible to the user.
 */
export const useIsWindowVisible = (): boolean => {
  const [focused, setFocused] = useState<boolean>(isWindowVisible());

  useEffect(() => {
    if (!VISIBILITY_STATE_SUPPORTED) return undefined;

    const listener = () => setFocused(isWindowVisible());
    document.addEventListener('visibilitychange', listener);
    return () => {
      document.removeEventListener('visibilitychange', listener);
    };
  }, []);

  return focused;
};
