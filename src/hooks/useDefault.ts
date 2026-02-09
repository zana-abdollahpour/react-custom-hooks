import { useCallback, useRef, useState } from "react";

export function useDefault<TState>(initialValue: TState, defaultState: TState) {
  const defaultStateRef = useRef(defaultState);
  const [state, setState] = useState(initialValue);

  const handleSetState = useCallback((newState: TState | null | undefined) => {
    const isNullish = newState === undefined || newState === null;
    setState(isNullish ? defaultStateRef.current : newState);
  }, []);

  return [state, handleSetState];
}

export function useDefault2<TState>(
  initialValue: TState,
  defaultState: TState,
) {
  const [state, setState] = useState(initialValue);

  const isNullish = state === undefined || state === null;
  const returnedState = isNullish ? defaultState : state;

  return [returnedState, setState];
}
