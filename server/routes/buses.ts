import { RequestHandler } from "express";
import type { Bus, BusesResponse } from "@shared/api";
import { ROUTES } from "@shared/routes";

// Demo city center (Jaipur, India)
const CITY = { name: "Jaipur", lat: 26.9124, lng: 75.7873 };

let buses: Bus[] = [];

function initBuses() {
  const now = Date.now();
  buses = [
    {
      id: "B-101",
      lat: 26.918,
      lng: 75.804,
      routeId: "R1",
      heading: 90,
      speedKmph: 28,
      lastUpdated: now,
      driver: { name: "R. Singh", phone: "+91 90000 11111" },
    },
    {
      id: "B-202",
      lat: 26.936,
      lng: 75.832,
      routeId: "R2",
      heading: 45,
      speedKmph: 32,
      lastUpdated: now,
      driver: { name: "A. Kumar", phone: "+91 90000 22222" },
    },
    {
      id: "B-303",
      lat: 26.908,
      lng: 75.792,
      routeId: "R1",
      heading: 270,
      speedKmph: 24,
      lastUpdated: now,
      driver: { name: "S. Verma", phone: "+91 90000 33333" },
    },
  ];
}

function jitterPosition(bus: Bus) {
  // Move slightly each call to simulate live updates
  const maxDelta = 0.001; // ~100m
  const dLat = (Math.random() - 0.5) * 2 * maxDelta;
  const dLng = (Math.random() - 0.5) * 2 * maxDelta;
  bus.lat = bus.lat + dLat;
  bus.lng = bus.lng + dLng;
  bus.heading = (bus.heading + (Math.random() - 0.5) * 20 + 360) % 360;
  bus.speedKmph = Math.max(
    10,
    Math.min(40, bus.speedKmph + (Math.random() - 0.5) * 5),
  );
  bus.lastUpdated = Date.now();
}

initBuses();

export const handleBuses: RequestHandler = (_req, res) => {
  buses.forEach(jitterPosition);
  const response: BusesResponse = {
    city: CITY.name,
    updatedAt: Date.now(),
    buses,
  };
  res.json(response);
};
