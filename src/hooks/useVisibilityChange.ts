import { useSyncExternalStore } from "react";

const subscribe = (cb: () => void) => {
  window.addEventListener("visibilitychange", cb);

  return () => window.removeEventListener("visibilitychange", cb);
};

const getSnapshot = () => document.visibilityState;

const getSeverSnapshot = () => {
  throw new Error(
    "useVisibilityChange is a hook and should be used on the client side.",
  );
};

export function useVisibilityChange() {
  const visibilityState = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getSeverSnapshot,
  );

  return visibilityState === "visible";
}
