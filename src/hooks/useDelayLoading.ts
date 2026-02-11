import { useState, useEffect, useRef } from "react";

type State = "IDLE" | "DELAY" | "DISPLAY" | "EXPIRE";

interface DelayLoadingOptions {
  delay: number;
  minDuration: number;
  ssr: boolean;
}

const defaultOptions: DelayLoadingOptions = {
  delay: 500,
  minDuration: 200,
  ssr: false,
};

export function useDelayLoading(
  loading: boolean,
  userOptions?: DelayLoadingOptions,
): boolean {
  const { ssr, delay, minDuration } = { ...defaultOptions, ...userOptions };

  const isSSR = useIsSSR() && ssr;
  const initialState = isSSR && loading ? "DISPLAY" : "IDLE";
  const timeout = useRef<number | undefined>(undefined);
  const [state, setState] = useState<State>(initialState);

  useEffect(() => {
    if (loading && (state === "IDLE" || isSSR)) {
      clearTimeout(timeout.current);

      const calculatedDelay = isSSR ? 0 : delay;
      timeout.current = setTimeout(() => {
        if (!loading) {
          setState("IDLE");
          return;
        }

        timeout.current = setTimeout(() => {
          setState("EXPIRE");
        }, minDuration);

        setState("DISPLAY");
      }, calculatedDelay);

      if (!isSSR) {
        setState("DELAY");
      }
    }

    if (!loading && state !== "DISPLAY") {
      clearTimeout(timeout.current);
      setState("IDLE");
    }
  }, [loading, state, delay, minDuration, isSSR]);

  useEffect(() => {
    return () => clearTimeout(timeout.current);
  }, []);

  return state === "DISPLAY" || state === "EXPIRE";
}

function useIsSSR() {
  const [isSSR, setIsSSR] = useState(true);

  useEffect(() => {
    setIsSSR(false);
  }, []);

  return isSSR;
}
