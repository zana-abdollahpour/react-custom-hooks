import { useCallback, useReducer, useRef } from "react";

type State<TState> = {
  past: TState[];
  present: TState;
  future: TState[];
};

type Action<TState> =
  | { type: "UNDO" }
  | { type: "REDO" }
  | { type: "SET"; newPresent: TState }
  | { type: "CLEAR"; initialPresent: TState };

const reducer = <TState>(
  state: State<TState>,
  action: Action<TState>,
): State<TState> => {
  const { past, present, future } = state;

  switch (action.type) {
    case "UNDO":
      return {
        past: past.slice(0, past.length - 1),
        present: past[past.length - 1],
        future: [present, ...future],
      };

    case "REDO":
      return {
        past: [...past, present],
        present: future[0],
        future: future.slice(1),
      };

    case "SET": {
      const { newPresent } = action;

      if (newPresent === present) {
        return state;
      }

      return {
        past: [...past, present],
        present: newPresent,
        future: [],
      };
    }

    case "CLEAR":
      return {
        past: [],
        present: action.initialPresent,
        future: [],
      };

    default:
      throw new Error("Unsupported action type");
  }
};

export default function useHistoryState<TState>(initialPresent: TState) {
  const initialPresentRef = useRef(initialPresent);

  const [state, dispatch] = useReducer(reducer<TState>, {
    past: [],
    present: initialPresent,
    future: [],
  });

  const canUndo = state.past.length !== 0;
  const canRedo = state.future.length !== 0;

  const undo = useCallback(() => {
    if (canUndo) {
      dispatch({ type: "UNDO" });
    }
  }, [canUndo]);

  const redo = useCallback(() => {
    if (canRedo) {
      dispatch({ type: "REDO" });
    }
  }, [canRedo]);

  const set = useCallback(
    (newPresent: TState) => dispatch({ type: "SET", newPresent }),
    [],
  );

  const clear = useCallback(
    () =>
      dispatch({ type: "CLEAR", initialPresent: initialPresentRef.current }),
    [],
  );

  return { state: state.present, canUndo, canRedo, set, undo, redo, clear };
}
