import { useEffect, useEffectEvent } from "react";

export default function usePageLeave(
  cb: <TArgs extends [], TReturn>(...args: TArgs) => TReturn,
) {
  const onLeave = useEffectEvent((event: MouseEvent) => {
    const to = event.relatedTarget as Node | null;
    if (!to || to.nodeName === "HTML") cb();
  });

  useEffect(() => {
    document.addEventListener("mouseout", onLeave);

    return () => {
      document.removeEventListener("mouseout", onLeave);
    };
  }, [onLeave]);
}
