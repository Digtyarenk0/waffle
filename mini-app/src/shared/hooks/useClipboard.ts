import { useCallback, useEffect, useMemo, useState } from 'react';

import { copyToClipboard } from 'shared/utils/copy-to-clipboard';

export const useClipboard = (val: string, t = 550) => {
  const [isCopied, setIsCopied] = useState(false);

  const copy = useCallback(() => {
    copyToClipboard(val);
    setIsCopied(true);
  }, [val]);

  useEffect(() => {
    if (isCopied) {
      setTimeout(() => setIsCopied(false), t);
    }
  }, [isCopied, t]);

  return useMemo(
    () => ({
      isCopied,
      copy,
    }),
    [isCopied, copy],
  );
};
