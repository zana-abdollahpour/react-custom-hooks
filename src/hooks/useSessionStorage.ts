import { useCallback, useEffect, useSyncExternalStore } from "react";

const sortedStringify = <T>(value: T): string => {
  if (value === null || value === undefined) {
    return JSON.stringify(value);
  }

  if (typeof value !== "object") {
    return JSON.stringify(value);
  }

  if (Array.isArray(value)) {
    return JSON.stringify(
      value.map((item) =>
        typeof item === "object" && item !== null
          ? JSON.parse(sortedStringify(item))
          : item,
      ),
    );
  }

  const sortedKeys = Object.keys(value).sort();
  const sortedObj: Record<string, unknown> = {};

  for (const key of sortedKeys) {
    const val = (value as Record<string, unknown>)[key];
    sortedObj[key] =
      typeof val === "object" && val !== null
        ? JSON.parse(sortedStringify(val))
        : val;
  }

  return JSON.stringify(sortedObj);
};

const dispatchStorageEvent = (key: string, newValue: string | null) => {
  window.dispatchEvent(new StorageEvent("storage", { key, newValue }));
};

const setItem = <TValue>(key: string, value: TValue) => {
  const stringifiedValue = sortedStringify(value);
  window.sessionStorage.setItem(key, stringifiedValue);
  dispatchStorageEvent(key, stringifiedValue);
};

const removeItem = (key: string) => {
  window.sessionStorage.removeItem(key);
  dispatchStorageEvent(key, null);
};

const getItem = (key: string) => {
  return window.sessionStorage.getItem(key);
};

const subscribe = (callback: () => void) => {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
};

const getServerSnapshot = () => {
  throw Error(
    "useSessionStorage is a hook and should be used on the client side.",
  );
};

export function useSessionStorage<TValue>(key: string, initialValue: TValue) {
  const getSnapshot = () => getItem(key);

  const stringifiedValue = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const setState = useCallback(
    (val: TValue | ((prevValue: TValue) => TValue)) => {
      try {
        const storedValue = stringifiedValue
          ? (JSON.parse(stringifiedValue) as TValue)
          : initialValue;

        const nextState = val instanceof Function ? val(storedValue) : val;

        const shouldRemove = nextState === undefined || nextState === null;

        if (shouldRemove) {
          removeItem(key);
        } else {
          setItem(key, nextState);
        }
      } catch (e) {
        console.warn(e);
      }
    },
    [key, stringifiedValue, initialValue],
  );

  useEffect(() => {
    const shouldStore = getItem(key) === null && initialValue !== undefined;
    if (shouldStore) setItem(key, initialValue);
  }, [key, initialValue]);

  return [
    stringifiedValue ? (JSON.parse(stringifiedValue) as TValue) : initialValue,
    setState,
  ] as const;
}
