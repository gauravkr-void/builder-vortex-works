import { MapContainer, TileLayer, Marker, Popup, useMap, CircleMarker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useMemo, useState } from "react";
import type { BusesResponse, Bus, RouteInfo, ETAInfo } from "@shared/api";
import { distanceMeters, etaMinutes } from "@shared/geo";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const defaultCenter = { lat: 26.9124, lng: 75.7873 };

const busIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function Recenter({ center }: { center: { lat: number; lng: number } }) {
  const map = useMap();
  useEffect(() => {
    map.setView([center.lat, center.lng]);
  }, [center.lat, center.lng, map]);
  return null;
}

export function TransportMap({
  routes,
  onEta,
  onNotify,
  notifyTarget,
  className,
}: {
  routes: RouteInfo[];
  onEta?: (eta: ETAInfo) => void;
  onNotify?: (busId: string) => void;
  notifyTarget?: { busId: string } | null;
  className?: string;
}) {
  const [buses, setBuses] = useState<Bus[]>([]);
  const [userPos, setUserPos] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserPos({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => setUserPos(null),
      );
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function fetchBuses() {
      const res = await fetch("/api/buses");
      const data = (await res.json()) as BusesResponse;
      if (!cancelled) setBuses(data.buses);
    }
    fetchBuses();
    const id = setInterval(fetchBuses, 5000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  useEffect(() => {
    if (!notifyTarget || !userPos) return;
    const bus = buses.find((b) => b.id === notifyTarget.busId);
    if (!bus) return;
    const d = distanceMeters(bus, userPos);
    const m = etaMinutes(d, bus.speedKmph);
    if (m <= 5) {
      toast.success(`Bus ${bus.id} is ~${m.toFixed(0)} min away`);
    }
  }, [buses, notifyTarget, userPos]);

  const center = userPos ?? defaultCenter;

  return (
    <div className={"relative w-full rounded-lg overflow-hidden border " + (className ?? "h-[60vh]")}>
      <div className="absolute left-3 top-3 z-[1000] flex gap-2">
        <Button size="sm" variant="secondary" onClick={async () => {
          try {
            const r = await fetch('/api/google-location');
            const j = await r.json();
            if (r.ok && j.lat && j.lng) {
              setUserPos({ lat: j.lat, lng: j.lng });
              toast.success('Located via Google');
            } else {
              toast.error(j.error || 'Unable to get Google location');
            }
          } catch (e) {
            toast.error('Location request failed');
          }
        }}>Locate me (Google)</Button>
      </div>
      <MapContainer center={[center.lat, center.lng]} zoom={13} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Recenter center={center} />
        {userPos && (
          <CircleMarker center={[userPos.lat, userPos.lng]} radius={8} pathOptions={{ color: '#2563eb', fillColor: '#3b82f6', fillOpacity: 0.9 }} />
        )}
        {buses.map((bus) => {
          const route = routes.find((r) => r.id === bus.routeId);
          let eta: ETAInfo | null = null;
          if (userPos) {
            const d = distanceMeters(bus, userPos);
            const m = etaMinutes(d, bus.speedKmph);
            eta = { busId: bus.id, minutes: m, distanceMeters: d };
          }
          return (
            <Marker key={bus.id} position={[bus.lat, bus.lng]} icon={busIcon}>
              <Popup>
                <div className="space-y-1">
                  <div className="font-medium">{bus.id} • {route?.name ?? bus.routeId}</div>
                  {eta && (
                    <div className="text-sm text-muted-foreground">ETA ~ {eta.minutes.toFixed(0)} min • {(eta.distanceMeters/1000).toFixed(1)} km</div>
                  )}
                  <div className="text-sm">Driver: {bus.driver.name} ({bus.driver.phone})</div>
                  <div className="text-xs text-muted-foreground">Speed: {bus.speedKmph.toFixed(0)} km/h</div>
                  {eta && (
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <Button size="sm" onClick={() => onEta && onEta(eta!)}>View ETA</Button>
                      <Button size="sm" variant="secondary" onClick={() => onNotify && onNotify(bus.id)}>Notify 5 min</Button>
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
