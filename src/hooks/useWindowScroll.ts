import { useCallback, useLayoutEffect, useState } from "react";

type scrollToParameters = Parameters<typeof window.scrollTo>;

interface ScrollPosition {
  x: number | null;
  y: number | null;
}

export default function useWindowScroll() {
  const [state, setState] = useState<ScrollPosition>({ x: null, y: null });

  const scrollTo = useCallback((...args: scrollToParameters) => {
    if (typeof args[0] === "object") {
      window.scrollTo(args[0]);
    } else if (typeof args[0] === "number" && typeof args[1] === "number") {
      window.scrollTo(args[0], args[1]);
    } else {
      throw new Error(`Invalid arguments passed to scrollTo`);
    }
  }, []);

  useLayoutEffect(() => {
    const handleScroll = () => {
      setState({ x: window.scrollX, y: window.scrollY });
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return [state.x, state.y, scrollTo];
}
