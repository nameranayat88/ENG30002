const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const locations = [
  { name: "Swinburne Car Park", coords: { lat: -37.820717870866375, lng: 145.03786293862672 }, status: "Available", price: 0.23, energySource: "Solar" },
  { name: "CBD", coords: { lat: -37.80790996494552, lng: 144.9680209676525 }, status: "Available", price: 0.45, energySource: "Grid" },
  { name: "Clayton", coords: { lat: -37.907553985228446, lng: 145.13592985617817 }, status: "Occupied", price: 0.20, energySource: "Solar" },
  { name: "Box Hill", coords: { lat: -37.8194, lng: 145.1250 }, status: "Available", price: 0.30, energySource: "Solar" },
  { name: "Richmond", coords: { lat: -37.8182, lng: 144.9980 }, status: "Occupied", price: 0.50, energySource: "Grid" },
  { name: "Glen Waverley", coords: { lat: -37.8804, lng: 145.1648 }, status: "Available", price: 0.18, energySource: "Solar" },
  { name: "Docklands", coords: { lat: -37.814, lng: 144.946 }, status: "Available", price: 0.30, energySource: "Grid" },
  { name: "Fitzroy", coords: { lat: -37.802, lng: 144.978 }, status: "Occupied", price: 0.22, energySource: "Grid" },
  { name: "Carlton", coords: { lat: -37.800, lng: 144.964 }, status: "Available", price: 0.40, energySource: "Solar" }
];

app.post("/predict", (req, res) => {
  const { userLat, userLng, batteryLevel = 1.0 } = req.body;

  console.log("---- Incoming Request ----");
  console.log("User Location:", userLat, userLng);
  console.log("Battery Level:", batteryLevel);

  if (!userLat || !userLng || isNaN(batteryLevel) || batteryLevel <= 0) {
    console.warn("Invalid input data!");
    return res.status(400).json({ error: "Invalid or missing coordinates or battery level" });
  }

  const scored = locations
    .filter(loc => loc.status === "Available")
    .map(loc => {
      const dist = calculateDistance(userLat, userLng, loc.coords.lat, loc.coords.lng);
      const withinBattery = batteryLevel * 100 >= dist;
      const score = withinBattery ? calculateScore(loc.price, dist, loc.energySource) : 0;
      return { ...loc, distance: dist, score, withinBattery };
    })
    .filter(loc => loc.withinBattery)
    .sort((a, b) => b.score - a.score);

  const recommended = scored.length > 0 ? scored[0] : null;
  const nextBest = scored.length > 1 ? scored[1] : null;

  if (recommended) {
    console.log("✅ Recommended:", recommended.name);
  } else {
    console.warn("❌ No available location matched user's range.");
  }

  res.json({ recommended, nextBest });
});

function calculateDistance(lat1, lon1, lat2, lon2) {
  const toRad = x => (x * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((R * c).toFixed(2));
}

function calculateScore(price, distance, source) {
  const priceScore = 1 - price; // cheaper = better
  const distanceScore = 1 / (distance + 0.1); // closer = better
  const solarBonus = source === "Solar" ? 1 : 0; // prefer solar
  return parseFloat((priceScore * 0.4 + distanceScore * 0.4 + solarBonus * 0.2).toFixed(3));
}

app.listen(PORT, () => {
  console.log(`🚀 AI backend running on port ${PORT}`);
});