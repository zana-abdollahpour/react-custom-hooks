import { useRef } from "react";

export function usePrevious<TValue>(value: TValue) {
  const ref = useRef<{ value: TValue; prev: TValue | null }>({
    value,
    prev: null,
  });

  if (ref.current.value !== value) {
    ref.current.prev = ref.current.value;
    ref.current.value = value;
  }

  return ref.current.prev;
}
