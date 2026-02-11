import { useEffect, useEffectEvent } from "react";

export function useEventListener(
  target: React.RefObject<HTMLElement> | Document | Window | null | undefined,
  event: keyof DocumentEventMap,
  handler: <TArgs extends [], TReturn>(...args: TArgs) => TReturn,
  options?: AddEventListenerOptions,
) {
  const onEvent = useEffectEvent(handler);

  useEffect(() => {
    const targetElement =
      target && "current" in target ? target.current : target;

    if (!targetElement) return;

    targetElement.addEventListener(event, onEvent, options);

    return () => targetElement.removeEventListener(event, onEvent, options);
  }, [event, onEvent, options, target]);
}
