import { useSyncExternalStore } from "react";

export function useOnlineStatus() {
  const getSnapshot = () => window.navigator.onLine;

  const subscribe = (callback: () => void) => {
    window.addEventListener("online", callback);
    window.addEventListener("offline", callback);

    return () => {
      window.removeEventListener("online", callback);
      window.removeEventListener("offline", callback);
    };
  };

  const getServerSnapshot = () => true;

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
