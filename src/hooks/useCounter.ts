import { useCallback, useLayoutEffect, useMemo, useState } from "react";

const defaultOptions = {
  min: 0,
  max: Infinity,
};

export function useCounter(startValue = 0, options = defaultOptions) {
  const { min, max } = options;
  const [count, setCount] = useState(min);

  useLayoutEffect(() => {
    if (startValue < min) throw new Error("startValue is less than min.");
    if (startValue > max) throw new Error("startValue is greater than max.");
  }, [max, min, startValue]);

  const increment = useCallback(
    (val = 1) => {
      setCount((cur) => (cur + val <= max ? cur + val : cur));
    },
    [max],
  );

  const decrement = useCallback(
    (val = 1) => {
      setCount((cur) => (cur - val >= min ? cur - val : cur));
    },
    [min],
  );

  const set = useCallback((val: number) => {
    setCount(val);
  }, []);

  const reset = useCallback(() => {
    setCount(startValue);
  }, [startValue]);

  const countHandlers = useMemo(
    () => ({ increment, decrement, set, reset }),
    [decrement, increment, reset, set],
  );

  return [count, countHandlers];
}
