import { useEffect, useEffectEvent, useRef } from "react";

export function useLogger(name: string, ...rest: unknown[]) {
  const initialRenderRef = useRef(true);

  const onLog = useEffectEvent((event: string) => {
    console.log(`${name} => ${event}:\n`, rest);
  });

  useEffect(() => {
    if (!initialRenderRef.current) onLog("Update");
  });

  useEffect(() => {
    onLog("Mount");
    initialRenderRef.current = false;

    return () => {
      onLog("Unmount");
      initialRenderRef.current = true;
    };
  }, [onLog]);
}
