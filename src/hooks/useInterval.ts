import { useCallback, useEffect, useEffectEvent, useRef } from "react";

export function useInterval<TArgs extends [], TReturn>(
  cb: (...args: TArgs) => TReturn,
  interval: number,
) {
  const onInterval = useEffectEvent(cb);
  const timerIdRef = useRef<number | undefined>(undefined);

  const handleClearInterval = useCallback(() => {
    clearInterval(timerIdRef.current);
  }, []);

  useEffect(() => {
    timerIdRef.current = setInterval(onInterval, interval);

    return handleClearInterval;
  }, [handleClearInterval, interval, onInterval]);

  return handleClearInterval;
}

// if your version of React doesn't fully support useEffectEvent,
// use the below hook, just remember to MEMOIZE cb
export function useInterval2<TArgs extends [], TReturn>(
  cb: (...args: TArgs) => TReturn,
  interval: number,
) {
  const timerIdRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    timerIdRef.current = setInterval(cb, interval);

    return () => {
      clearInterval(timerIdRef.current);
    };
  }, [cb, interval]);

  return useCallback(() => {
    clearInterval(timerIdRef.current);
  }, []);
}
