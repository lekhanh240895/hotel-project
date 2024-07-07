import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import { AppDisPatch, RootState } from '../redux/store';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDisPatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
