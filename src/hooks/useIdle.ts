import { useEffect, useState } from "react";

function throttle(cb: () => void, ms: number) {
  let lastTime = 0;
  return () => {
    const now = Date.now();
    if (now - lastTime >= ms) {
      cb();
      lastTime = now;
    }
  };
}

const windowEvents: (keyof WindowEventMap)[] = [
  "mousemove",
  "mousedown",
  "resize",
  "keydown",
  "touchstart",
  "wheel",
];

export default function useIdle(timeout = 1000 * 20) {
  const [idle, setIdle] = useState(false);

  useEffect(() => {
    let timeoutId: number;

    const handleTimeout = () => setIdle(true);

    const handleEvent = throttle(() => {
      setIdle(false);
      clearTimeout(timeoutId);
      timeoutId = window.setTimeout(handleTimeout, timeout);
    }, 500);

    const handleVisibilityChange = () => {
      if (!document.hidden) handleEvent();
    };

    timeoutId = window.setTimeout(handleTimeout, timeout);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    windowEvents.forEach((e) => {
      window.addEventListener(e, handleEvent);
    });

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      windowEvents.forEach((e) => {
        window.removeEventListener(e, handleEvent);
      });
    };
  }, [timeout]);

  return idle;
}
