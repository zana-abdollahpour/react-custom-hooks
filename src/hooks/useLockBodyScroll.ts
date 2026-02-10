import { useLayoutEffect } from "react";

export function useLockBodyScroll() {
  useLayoutEffect(() => {
    const { overflow: prevOverflow } = window.getComputedStyle(document.body);

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);
}
