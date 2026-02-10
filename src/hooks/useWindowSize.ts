import { useLayoutEffect, useState } from "react";

export function useWindowSize() {
  const [size, setSize] = useState({ height: 0, width: 0 });

  useLayoutEffect(() => {
    const resizeHandler = () => {
      setSize({ height: window.innerHeight, width: window.innerWidth });
    };

    resizeHandler();

    window.addEventListener("resize", resizeHandler);

    return () => {
      window.removeEventListener("resize", resizeHandler);
    };
  }, []);

  return size;
}
