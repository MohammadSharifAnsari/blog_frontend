import { useDispatch, useSelector } from 'react-redux';

// Simple JS helpers — replace usages of useDispatch/useSelector if you prefer typed hooks
export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;