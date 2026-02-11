import { useEffect, useEffectEvent, useRef } from "react";

export function useClickAway(
  cb: <TArgs extends [], TReturn>(
    e: MouseEvent | TouchEvent,
    ...args: TArgs
  ) => TReturn,
) {
  const elementRef = useRef<HTMLElement | null>(null);

  const onEventHandler = useEffectEvent((e: MouseEvent | TouchEvent) => {
    const target = e.target;
    const element = elementRef.current;
    if (element && target instanceof Node && !element.contains(target)) cb(e);
  });

  useEffect(() => {
    document.addEventListener("mousedown", onEventHandler);
    document.addEventListener("touchstart", onEventHandler);

    return () => {
      document.removeEventListener("mousedown", onEventHandler);
      document.removeEventListener("touchstart", onEventHandler);
    };
  }, [onEventHandler]);

  return elementRef;
}
