import { useCallback, useEffect, useEffectEvent, useRef } from "react";

export function useTimeout(
  cb: <TArgs extends [], TReturn>(...args: TArgs) => TReturn,
  timeout: number,
) {
  const timerIdRef = useRef<number | null>(null);
  const onTimeout = useEffectEvent(cb);

  const handleClearTimeout = useCallback(() => {
    if (timerIdRef.current) clearInterval(timerIdRef.current);
  }, []);

  useEffect(() => {
    timerIdRef.current = setTimeout(onTimeout, timeout);

    return handleClearTimeout;
  }, [onTimeout, handleClearTimeout, timeout]);

  return handleClearTimeout;
}
