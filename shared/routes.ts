import type { RouteInfo } from "./api";

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
