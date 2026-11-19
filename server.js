import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.TANKERKOENIG_API_KEY;

app.use(express.static(path.join(__dirname, "public")));

app.get("/api/fuel", async (req, res) => {
  try {
    const lat = Number(req.query.lat);
    const lng = Number(req.query.lng);
    const radius = Math.min(25, Math.max(1, Number(req.query.radius || 10)));
    const fuel = String(req.query.fuel || "e10").toLowerCase();

    if (!Number.isFinite(lat) || lat < -90 || lat > 90 ||
        !Number.isFinite(lng) || lng < -180 || lng > 180 ||
        !["e5", "e10", "diesel"].includes(fuel)) {
      return res.status(400).json({ error: "Ungültige Koordinaten oder Kraftstoffart." });
    }
    if (!API_KEY) {
      return res.status(503).json({
        error: "Tankerkönig-API-Schlüssel fehlt. Bitte TANKERKOENIG_API_KEY als Umgebungsvariable setzen."
      });
    }

    const url = new URL("https://creativecommons.tankerkoenig.de/json/list.php");
    url.search = new URLSearchParams({
      lat: String(lat), lng: String(lng), rad: String(radius),
      type: fuel, sort: "dist", apikey: API_KEY
    });

    const upstream = await fetch(url, { headers: { "Accept": "application/json" } });
    const data = await upstream.json();
    if (!upstream.ok || data.ok === false) {
      return res.status(upstream.status || 502).json({
        error: data.message || "Tankerkönig konnte keine Preisdaten liefern."
      });
    }

    const stations = (data.stations || []).filter(s =>
      s && s.price != null && Number(s.price) > 0
    );
    const openStations = stations.filter(s => s.isOpen !== false);
    const pool = openStations.length ? openStations : stations;
    const average = pool.length
      ? pool.reduce((sum, s) => sum + Number(s.price), 0) / pool.length
      : null;

    return res.json({
      fuel, radiusKm: radius, count: pool.length,
      averagePrice: average == null ? null : Number(average.toFixed(3)),
      averageBasedOn: openStations.length ? "geöffnete Tankstellen" : "alle Stationen mit Preis",
      stations: pool.slice(0, 15).map(s => ({
        id: s.id, name: s.name, brand: s.brand, street: s.street,
        place: s.place, lat: s.lat, lng: s.lng,
        price: Number(s.price), distance: s.dist ?? null, isOpen: s.isOpen
      }))
    });
  } catch (err) {
    console.error("fuel api error:", err);
    res.status(502).json({ error: "Fehler beim Abruf der Tankerkönig-Daten." });
  }
});

app.get("/health", (_req, res) => res.json({ ok: true }));
app.listen(PORT, () => console.log(`Spritkosten-App läuft auf Port ${PORT}`));
