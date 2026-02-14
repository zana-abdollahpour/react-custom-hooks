import { useEffect, useState } from "react";

export function useIsCSR() {
  const [isCSR, setIsCSR] = useState(false);

  useEffect(() => {
    setIsCSR(true);
  }, []);

  return isCSR;
}
