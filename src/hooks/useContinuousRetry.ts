import { useEffect, useEffectEvent, useState } from "react";

interface Options {
  maxRetries: number;
  interval: number;
}

const defaultOptions: Options = {
  maxRetries: 3,
  interval: 1000,
};

export function useContinuousRetry(
  cb: <TArgs extends [], TReturn>(...args: TArgs) => TReturn,
  options: Partial<Options>,
) {
  const onInterval = useEffectEvent(cb);
  const [numRetries, setNumRetries] = useState(0);
  const [hasResolved, setHasResolved] = useState(false);
  const { interval, maxRetries } = { ...defaultOptions, ...options };

  useEffect(() => {
    const timerId = setInterval(() => {
      if (onInterval()) {
        setHasResolved(true);
        clearInterval(timerId);
      } else if (numRetries >= maxRetries) {
        clearInterval(timerId);
      } else {
        setNumRetries((cur) => cur + 1);
      }
    }, interval);

    return () => {
      clearInterval(timerId);
    };
  }, [interval, maxRetries, numRetries, onInterval]);

  return { hasResolved, numRetries };
}
