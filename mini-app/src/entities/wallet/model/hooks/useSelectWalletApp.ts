import { useTypedSelector } from 'entities/store/model/useStore';

export const useWallet = () => {
  const wallet = useTypedSelector((s) => s.wallet);

  return wallet;
};
