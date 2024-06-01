import { useTypedSelector } from 'entities/store/model/useStore';

import useBlock from '../context/useBlock';

export const useCallDeps = () => {
  const block = useBlock();
  const transactionCount = useTypedSelector((state) => state.wallet.transactionsCount);
  return `${block}_${transactionCount}`;
};
