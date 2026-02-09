import { useSyncExternalStore } from "react";

const subscribe = (subFn: () => void) => {
  window.addEventListener("languagechange", subFn);
  return () => window.removeEventListener("languagechange", subFn);
};

const getSnapshot = () => navigator.language;

const getServerSnapshot = () => {
  throw new Error(
    "usePreferredLanguage is a hook and should be used on the client side.",
  );
};

export function usePreferredLanguage() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
