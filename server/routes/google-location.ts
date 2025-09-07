import { RequestHandler } from "express";

export const handleGoogleLocation: RequestHandler = async (_req, res) => {
  const key = process.env.GOOGLE_MAPS_API_KEY;
  if (!key) {
    return res.status(400).json({ error: "GOOGLE_MAPS_API_KEY is not set" });
  }
  try {
    const url = `https://www.googleapis.com/geolocation/v1/geolocate?key=${encodeURIComponent(
      key,
    )}`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ considerIp: true }),
    });
    if (!response.ok) {
      const text = await response.text();
      return res.status(502).json({ error: "Google API error", details: text });
    }
    const data = (await response.json()) as {
      location: { lat: number; lng: number };
    };
    return res.json({ lat: data.location.lat, lng: data.location.lng });
  } catch (e: any) {
    return res
      .status(500)
      .json({
        error: "Failed to fetch location",
        details: String(e?.message ?? e),
      });
  }
};
