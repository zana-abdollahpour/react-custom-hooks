import { useCallback, useEffect, useEffectEvent, useRef } from "react";

function getRandomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default function useRandomInterval(
  minDelay: number,
  maxDelay: number,
  cb: <TArgs extends [], TReturn>(...args: TArgs) => TReturn,
) {
  const onInterval = useEffectEvent(cb);
  const timeoutId = useRef<number | null>(null);

  const handleClearTimeout = useCallback(() => {
    if (timeoutId.current) window.clearTimeout(timeoutId.current);
  }, []);

  useEffect(() => {
    const tick = () => {
      const interval = getRandomNumber(minDelay, maxDelay);
      timeoutId.current = window.setTimeout(() => {
        onInterval();
        tick();
      }, interval);
    };

    tick();

    return handleClearTimeout;
  }, [handleClearTimeout, maxDelay, minDelay, onInterval]);

  return handleClearTimeout;
}
