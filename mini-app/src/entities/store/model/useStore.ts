import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

import { RootState, AppDispatch } from './index';

export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useTypedDispatch = () => useDispatch<AppDispatch>();
