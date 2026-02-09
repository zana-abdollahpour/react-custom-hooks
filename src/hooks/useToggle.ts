import { useCallback, useState } from "react";

export function useToggle(initialState: boolean) {
  const [isTrue, setIsTrue] = useState(initialState);

  const handleToggle = useCallback(() => setIsTrue((cur) => !cur), []);

  return [isTrue, handleToggle];
}
