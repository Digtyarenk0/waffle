import useBlock from '../context/useBlock';

export const useCallDeps = () => {
  const block = useBlock();
  return `${block}_`;
};
