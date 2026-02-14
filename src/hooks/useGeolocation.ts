import { useEffect, useRef, useState } from "react";

interface GeolocationState {
  loading: boolean;
  timestamp: number | null;
  error: GeolocationPositionError | null;
  accuracy: GeolocationCoordinates["accuracy"] | null;
  latitude: GeolocationCoordinates["latitude"] | null;
  longitude: GeolocationCoordinates["longitude"] | null;
  altitude: GeolocationCoordinates["altitude"];
  altitudeAccuracy: GeolocationCoordinates["altitudeAccuracy"];
  heading: GeolocationCoordinates["heading"];
  speed: GeolocationCoordinates["speed"];
}

export function useGeolocation(options: PositionOptions = {}) {
  const [state, setState] = useState<GeolocationState>({
    loading: true,
    accuracy: null,
    latitude: null,
    longitude: null,
    altitude: null,
    altitudeAccuracy: null,
    heading: null,
    speed: null,
    timestamp: null,
    error: null,
  });

  const optionsRef = useRef(options);

  useEffect(() => {
    const onEvent: PositionCallback = ({ coords, timestamp }) => {
      setState({
        loading: false,
        timestamp,
        latitude: coords.latitude,
        longitude: coords.longitude,
        altitude: coords.altitude,
        accuracy: coords.accuracy,
        altitudeAccuracy: coords.altitudeAccuracy,
        heading: coords.heading,
        speed: coords.speed,
        error: null,
      });
    };

    const onEventError: PositionErrorCallback = (error) => {
      setState((cur) => ({
        ...cur,
        loading: false,
        error,
      }));
    };

    navigator.geolocation.getCurrentPosition(
      onEvent,
      onEventError,
      optionsRef.current,
    );

    const watchId = navigator.geolocation.watchPosition(
      onEvent,
      onEventError,
      optionsRef.current,
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  return state;
}
