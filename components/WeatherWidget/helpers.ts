// WEATHER ICON LAYERS
export const weatherCodeToLayers = (code: number, isDay: number) => {
  const night = isDay === 0;

  const sun = night ? null : "☀️";
  const moon = night ? "🌙" : null;

  switch (code) {
    case 0:
      return { sun, moon, clouds: null, precip: null };
    case 1:
    case 2:
      return { sun, moon, clouds: "☁️", precip: null };
    case 3:
      return { sun: null, moon: null, clouds: "☁️", precip: null };
    case 45:
    case 48:
      return { sun: null, moon: null, clouds: "🌫️", precip: null };
    case 51:
    case 53:
    case 55:
      return { sun, moon, clouds: "☁️", precip: "🌧️" };
    case 61:
    case 63:
    case 65:
      return { sun, moon, clouds: null, precip: "🌧️" };
    case 71:
    case 73:
    case 75:
      return { sun: null, moon: null, clouds: "☁️", precip: "🌨️" };
    case 80:
    case 81:
    case 82:
      return { sun, moon, clouds: "☁️", precip: "🌧️" };
    case 95:
    case 96:
    case 99:
      return { sun, moon, clouds: "☁️", precip: "⛈️" };
    default:
      return { sun, moon, clouds: "☁️", precip: null };
  }
};

// MUNICIPALITY EXTRACTOR
export const extractMunicipality = (place: any) => {
  return (
    place.city ||
    place.town ||
    place.municipality ||
    place.village ||
    place.locality ||
    "Unknown"
  );
};
