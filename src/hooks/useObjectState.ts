import { useCallback, useState } from "react";

const isPlainObject = (
  variable: unknown,
): variable is Record<string, unknown> =>
  Object.prototype.toString.call(variable) === "[object Object]";

export function useObjectState<TObject extends Record<string, unknown>>(
  initialValue: TObject,
) {
  const [objectState, setObjectState] = useState<TObject>(initialValue);

  const handleUpdateObjectState = useCallback(
    (arg: Partial<TObject> | ((current: TObject) => Partial<TObject>)) =>
      setObjectState((curObjectState) => {
        if (typeof arg === "function") {
          const newState = arg(curObjectState);
          return isPlainObject(newState)
            ? { ...curObjectState, ...newState }
            : curObjectState;
        } else if (isPlainObject(arg)) {
          return { ...curObjectState, ...arg };
        } else {
          return curObjectState;
        }
      }),
    [],
  );

  return [objectState, handleUpdateObjectState] as const;
}
