import { useEffect, useEffectEvent, useRef, useState } from "react";

interface useCountdownParams {
  endTime: number;
  interval: number;
  onInterval: () => void;
  onComplete: () => void;
}

export function useCountdown({
  endTime,
  interval,
  onInterval,
  onComplete,
}: useCountdownParams) {
  const intervalIdRef = useRef<number | null>(null);
  const [count, setCount] = useState(
    Math.round((endTime - Date.now()) / interval),
  );

  const handleClearInterval = () => {
    if (intervalIdRef.current) clearInterval(intervalIdRef.current);
  };

  const onIntervalHandler = useEffectEvent(() => {
    if (count === 0) {
      handleClearInterval();
      onComplete();
    } else {
      setCount((cur) => cur - 1);
      onInterval();
    }
  });

  useEffect(() => {
    intervalIdRef.current = setInterval(onIntervalHandler, interval);
    return handleClearInterval;
  }, [interval, onIntervalHandler]);

  return count;
}
