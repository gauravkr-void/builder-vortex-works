import { RequestHandler } from "express";
import type { Bus, BusesResponse, RouteInfo } from "@shared/api";

// Demo city center (Jaipur, India)
const CITY = { name: "Jaipur", lat: 26.9124, lng: 75.7873 };

// Mock routes and stops (static)
export const ROUTES: RouteInfo[] = [
  {
    id: "R1",
    name: "Pink Line",
    code: "P1",
    stops: [
      { id: "S1", name: "Sindhi Camp", lat: 26.9237, lng: 75.8031 },
      { id: "S2", name: "MI Road", lat: 26.9156, lng: 75.8135 },
      { id: "S3", name: "Ajmeri Gate", lat: 26.9123, lng: 75.8177 },
      { id: "S4", name: "Gopalbari", lat: 26.9148, lng: 75.792 },
    ],
  },
  {
    id: "R2",
    name: "Amber Express",
    code: "A2",
    stops: [
      { id: "S5", name: "Hawa Mahal", lat: 26.9239, lng: 75.8267 },
      { id: "S6", name: "Jal Mahal", lat: 26.9533, lng: 75.8461 },
      { id: "S7", name: "Amer Fort", lat: 26.9855, lng: 75.8513 },
      { id: "S8", name: "Badi Chaupar", lat: 26.9251, lng: 75.8261 },
    ],
  },
];

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
  bus.speedKmph = Math.max(10, Math.min(40, bus.speedKmph + (Math.random() - 0.5) * 5));
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
