// hooks/useLizardLocation.ts
import { useState, useEffect } from "react";

interface Location {
  latitude: number | null;
  longitude: number | null;
  error?: string;
  loading: boolean;
}

export function useLocation() {
  const [location, setLocation] = useState<Location>({
    latitude: null,
    longitude: null,
    error: undefined,
    loading: true,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation({
        latitude: null,
        longitude: null,
        error: "Geolocation is not supported by this browser.",
        loading: false,
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          loading: false,
        });
      },
      (err) => {
        setLocation({
          latitude: null,
          longitude: null,
          error: err.message,
          loading: false,
        });
      },
      { enableHighAccuracy: true }
    );
  }, []);

  return location;
}
