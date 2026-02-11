import { useCallback, useEffect, useEffectEvent, useRef } from "react";

interface Options {
  time: number;
  when: boolean;
  startImmediately: boolean;
}

const defaultOptions: Options = {
  time: 1000,
  when: true,
  startImmediately: true,
};

export function useIntervalWhen(
  cb: <TArgs extends [], TReturn>(...args: TArgs) => TReturn,
  opts: Partial<Options>,
) {
  const { time, when, startImmediately } = { ...defaultOptions, ...opts };

  const onTick = useEffectEvent(cb);
  const timerId = useRef<number | null>(null);
  const alreadyCalled = useRef(!startImmediately);

  const handleClearInterval = useCallback(() => {
    if (timerId.current) clearInterval(timerId.current);
    alreadyCalled.current = false;
  }, []);

  useEffect(() => {
    if (when === true) {
      timerId.current = window.setInterval(onTick, time);

      if (startImmediately === true && alreadyCalled.current === false) {
        onTick();
        alreadyCalled.current = true;
      }

      return handleClearInterval;
    }
  }, [handleClearInterval, onTick, startImmediately, time, when]);

  return handleClearInterval;
}
