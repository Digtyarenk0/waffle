import { ITokenList } from '../store';

export const getUniqueListBy = <T extends ITokenList, K extends keyof ITokenList>(arr: T[], key: K): T[] => {
  const seen = new Set();
  return arr.filter((item) => {
    const keyValue = item[key];
    if (seen.has(keyValue)) {
      return false;
    }
    seen.add(keyValue);
    return true;
  });
};
