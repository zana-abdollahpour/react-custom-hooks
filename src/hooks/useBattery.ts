import { useEffect, useState } from "react";

declare global {
  interface BatteryManager extends EventTarget {
    charging: boolean;
    chargingTime: number;
    dischargingTime: number;
    level: number;
    addEventListener(
      type: string,
      listener: EventListenerOrEventListenerObject,
    ): void;
    removeEventListener(
      type: string,
      listener: EventListenerOrEventListenerObject,
    ): void;
  }

  interface Navigator {
    getBattery?: () => Promise<BatteryManager>;
  }
}

interface BatteryStatus {
  supported: boolean;
  isLoading: boolean;
  level: number | null;
  charging: boolean | null;
  chargingTime: number | null;
  dischargingTime: number | null;
}

const batteryEvents = [
  "levelchange",
  "chargingchange",
  "chargingtimechange",
  "dischargingtimechange",
] as const;

export function useBattery() {
  const [batteryState, setBatteryState] = useState<BatteryStatus>({
    supported: false,
    isLoading: true,
    level: null,
    charging: null,
    chargingTime: null,
    dischargingTime: null,
  });

  useEffect(() => {
    let battery: BatteryManager | null = null;

    const handleChange = () => {
      if (!battery) return;

      setBatteryState({
        supported: true,
        isLoading: false,
        level: battery.level,
        charging: battery.charging,
        chargingTime: battery.chargingTime,
        dischargingTime: battery.dischargingTime,
      });
    };

    if (!navigator.getBattery) {
      setBatteryState((cur) => ({
        ...cur,
        isLoading: false,
        supported: false,
      }));
    } else {
      navigator.getBattery().then((btr) => {
        battery = btr;
        batteryEvents.forEach((btrEvent) =>
          btr.addEventListener(btrEvent, handleChange),
        );
        handleChange();
      });
    }

    return () => {
      if (battery) {
        batteryEvents.forEach((btrEvent) =>
          battery!.removeEventListener(btrEvent, handleChange),
        );
      }
    };
  }, []);

  return batteryState;
}
