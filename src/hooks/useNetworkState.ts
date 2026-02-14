import { useRef, useSyncExternalStore } from "react";

interface NetworkInformation extends EventTarget {
  readonly downlink?: number;
  readonly downlinkMax?: number;
  readonly effectiveType?: "slow-2g" | "2g" | "3g" | "4g";
  readonly rtt?: number;
  readonly saveData?: boolean;
  readonly type?:
    | "bluetooth"
    | "cellular"
    | "ethernet"
    | "none"
    | "wifi"
    | "wimax"
    | "other"
    | "unknown";
}

interface NavigatorWithConnection extends Navigator {
  readonly connection?: NetworkInformation;
  readonly mozConnection?: NetworkInformation;
  readonly webkitConnection?: NetworkInformation;
}

type NetworkState = {
  online: boolean;
  downlink?: number;
  downlinkMax?: number;
  effectiveType?: "slow-2g" | "2g" | "3g" | "4g";
  rtt?: number;
  saveData?: boolean;
  type?:
    | "bluetooth"
    | "cellular"
    | "ethernet"
    | "none"
    | "wifi"
    | "wimax"
    | "other"
    | "unknown";
};

type Obj = Record<PropertyKey, unknown>;

const isShallowEqual = (object1: Obj, object2: Obj): boolean => {
  const keys1 = Object.keys(object1);
  const keys2 = Object.keys(object2);

  if (keys1.length !== keys2.length) return false;

  for (const key of keys1) {
    if (object1[key] !== object2[key]) return false;
  }

  return true;
};

const getConnection = (): NetworkInformation | undefined => {
  const nav = navigator as NavigatorWithConnection;
  return nav?.connection || nav?.mozConnection || nav?.webkitConnection;
};

const subscribe = (callback: () => void) => {
  window.addEventListener("online", callback, { passive: true });
  window.addEventListener("offline", callback, { passive: true });

  const connection = getConnection();

  if (connection)
    connection.addEventListener("change", callback, { passive: true });

  return () => {
    window.removeEventListener("online", callback);
    window.removeEventListener("offline", callback);

    if (connection) connection.removeEventListener("change", callback);
  };
};

const getServerSnapshot = () => {
  throw new Error(
    "useNetworkState is a hook and should be used on the client side.",
  );
};

export function useNetworkState() {
  const cache = useRef<NetworkState>({
    online: true,
  });

  const getSnapshot = (): NetworkState => {
    const online = navigator.onLine;
    const connection = getConnection();

    const nextState: NetworkState = {
      online,
      downlink: connection?.downlink,
      downlinkMax: connection?.downlinkMax,
      effectiveType: connection?.effectiveType,
      rtt: connection?.rtt,
      saveData: connection?.saveData,
      type: connection?.type,
    };

    if (isShallowEqual(cache.current, nextState)) {
      return cache.current;
    } else {
      cache.current = nextState;
      return nextState;
    }
  };

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
