/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

export interface DemoResponse {
  message: string;
}

export interface Stop {
  id: string;
  name: string;
  lat: number;
  lng: number;
}

export interface RouteInfo {
  id: string;
  name: string;
  code: string;
  stops: Stop[];
}

export interface DriverInfo {
  name: string;
  phone: string;
}

export interface Bus {
  id: string;
  lat: number;
  lng: number;
  routeId: string;
  heading: number;
  speedKmph: number;
  lastUpdated: number; // epoch ms
  driver: DriverInfo;
}

export interface BusesResponse {
  city: string;
  updatedAt: number;
  buses: Bus[];
}

export interface ETAInfo {
  busId: string;
  minutes: number;
  distanceMeters: number;
}
