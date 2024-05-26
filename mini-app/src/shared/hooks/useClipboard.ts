import { useCallback, useEffect, useMemo, useState } from 'react';

import { copyToClipboard } from 'shared/utils/copy-to-clipboard';

export const useClipboard = (val: string) => {
  const [isCopied, setIsCopied] = useState(false);

  const copy = useCallback(() => {
    copyToClipboard(val);
    setIsCopied(true);
  }, [val]);

  useEffect(() => {
    if (isCopied) {
      setTimeout(() => setIsCopied(false), 550);
    }
  }, [isCopied]);

  return useMemo(
    () => ({
      isCopied,
      copy,
    }),
    [isCopied, copy],
  );
};
