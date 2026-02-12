import { useLayoutEffect, useState } from "react";

interface OrientationInfo {
  angle: ScreenOrientation["angle"];
  type: ScreenOrientation["type"] | "unknown";
}

export function useOrientation() {
  const [orientation, setOrientation] = useState<OrientationInfo>({
    angle: 0,
    type: "unknown",
  });

  useLayoutEffect(() => {
    const handleChange = () => {
      const { angle, type } = window.screen.orientation;
      setOrientation({ angle, type });
    };

    const handleChangeFallback = () => {
      setOrientation({ type: "unknown", angle: window.orientation });
    };

    if (window.screen?.orientation) {
      handleChange();
      window.screen.orientation.addEventListener("change", handleChange);
    } else {
      handleChangeFallback();
      window.addEventListener("orientationchange", handleChangeFallback);
    }

    return () => {
      if (window.screen?.orientation) {
        window.screen.orientation.removeEventListener("change", handleChange);
      } else {
        window.removeEventListener("orientationchange", handleChangeFallback);
      }
    };
  }, []);

  return orientation;
}
