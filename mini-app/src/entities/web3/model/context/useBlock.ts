import { useContext } from 'react';

import { BlockContext } from './block-context';

const useBlock = () => {
  const block = useContext(BlockContext);
  return block;
};

export default useBlock;
