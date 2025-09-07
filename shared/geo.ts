// Haversine distance in meters
export function distanceMeters(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const R = 6371000; // meters
  const toRad = (x: number) => (x * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);

  const sinDLat = Math.sin(dLat / 2);
  const sinDLng = Math.sin(dLng / 2);

  const c =
    sinDLat * sinDLat +
    Math.cos(lat1) * Math.cos(lat2) * sinDLng * sinDLng;
  const d = 2 * Math.atan2(Math.sqrt(c), Math.sqrt(1 - c));
  return R * d;
}

// Compute ETA in minutes given distance in meters and speed in km/h
export function etaMinutes(distanceMetersValue: number, speedKmph: number) {
  const speedMps = Math.max(0.1, speedKmph) * 1000 / 3600; // avoid divide by zero
  const seconds = distanceMetersValue / speedMps;
  return seconds / 60;
}
