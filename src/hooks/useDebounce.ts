import {useRef, useEffect, useMemo} from 'react';
import {debounce} from '../utils/debounce';

export const useDebounce = (callback: Function, delay: number) => {
  const ref = useRef<Function>();

  useEffect(() => {
    ref.current = callback;
  }, [callback]);

  const debouncedCallback = useMemo(() => {
    const func = () => {
      ref.current?.();
    };

    return debounce(func, delay);
  }, []);

  return debouncedCallback;
};
