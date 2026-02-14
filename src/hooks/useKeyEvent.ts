import { useEffect, useEffectEvent } from "react";

type KeyEvent = "keydown" | "keypress" | "keyup";

interface Options {
  event: KeyEvent;
  target: HTMLElement | Window | Document | null;
  eventOptions: boolean | AddEventListenerOptions | undefined;
}

const defaultOptions: Options = {
  event: "keydown",
  target: typeof window !== "undefined" ? window : null,
  eventOptions: undefined,
};

export function useKeyEvent(
  key: string,
  cb: (event: KeyboardEvent) => void,
  options?: Partial<Options>,
) {
  const onListen = useEffectEvent(cb);
  const { event, target, eventOptions } = { ...defaultOptions, ...options };

  useEffect(() => {
    const handler = (e: Event) => {
      if (e instanceof KeyboardEvent && e.key === key) onListen(e);
    };

    target?.addEventListener(event, handler, eventOptions);

    return () => {
      target?.removeEventListener(event, handler, eventOptions);
    };
  }, [key, target, event, eventOptions, onListen]);
}
