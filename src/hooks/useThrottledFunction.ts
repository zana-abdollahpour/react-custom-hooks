import { useEffect, useRef, useCallback, useEffectEvent } from "react";

export function useThrottledFunction<T extends (...args: unknown[]) => unknown>(
  callback: T,
  delay: number,
): [(...args: Parameters<T>) => void, () => void] {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastExecutedRef = useRef<number>(0);
  const onInvoke = useEffectEvent(callback);

  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => cancel();
  }, [cancel]);

  const throttledFn = useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      const timeSinceLastExecution = now - lastExecutedRef.current;

      const execute = () => {
        lastExecutedRef.current = Date.now();
        onInvoke(...args);
      };

      if (timeSinceLastExecution >= delay) {
        execute();
      } else if (!timeoutRef.current) {
        timeoutRef.current = setTimeout(() => {
          execute();
          timeoutRef.current = null;
        }, delay - timeSinceLastExecution);
      }
    },
    [delay, onInvoke],
  );

  return [throttledFn, cancel];
}

/* For older versions of React without useEffectEvent */
export function useThrottledFunction2<
  T extends (...args: unknown[]) => unknown,
>(callback: T, delay: number): [(...args: Parameters<T>) => void, () => void] {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastExecutedRef = useRef<number>(0);
  const callbackRef = useRef(callback);

  // Keep callback ref up to date
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cancel();
    };
  }, [cancel]);

  const throttledFn = useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      const timeSinceLastExecution = now - lastExecutedRef.current;

      const execute = () => {
        lastExecutedRef.current = Date.now();
        callbackRef.current(...args);
      };

      if (timeSinceLastExecution >= delay) {
        execute();
      } else if (!timeoutRef.current) {
        timeoutRef.current = setTimeout(() => {
          execute();
          timeoutRef.current = null;
        }, delay - timeSinceLastExecution);
      }
    },
    [delay],
  );

  return [throttledFn, cancel];
}
