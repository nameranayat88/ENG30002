<template>
  <div id="map" style="width: 100%; height: 400px"></div>
</template>

<script>
/* global google */
import greenMarker from "@/assets/green-marker.png";
import redMarker from "@/assets/red-marker.png";
import userMarkerIcon from "@/assets/user-marker.png";
import crownIcon from "@/assets/crown-marker.png";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import mqtt from "mqtt";

export default {
  name: "GoogleMap",
  props: {
  locations: Array,
  batteryRange: Number,
},
  data() {
    return {
      userLocation: null,
      userAddress: "",
      map: null,
      directionsService: null,
      directionsRenderer: null,
      userMarkerInstance: null,
      geocoder: null,
      recommendedInfoWindow: null,
      batteryCircle: null,
      bestSpot: null,
      allMarkers: [],
      markerCluster: null,
      client: null,
      mqttMessageReceived: false,
    };
  },
  mounted() {
    this.loadGoogleMaps();
    this.setupReevaluation();
    this.connectToMQTT();
  },
  watch: {
    batteryRange() {
      this.updateBatteryRangeCircle();
    },
    locations: {
      deep: true,
      handler() {
        this.evaluateSmartRecommendation();
        this.updateParkingMarkers(this.locations);
      },
    },
  },
  methods: {
    connectToMQTT() {
      this.client = mqtt.connect("wss://broker.emqx.io:8084/mqtt");
      this.client.on("connect", () => {
        this.client.subscribe("myTopic/sensor", (err) => {
          if (!err) {
            console.log("Subscribed to MQTT topic");
          }
        });
      });
      this.client.on("message", (topic, message) => {
        const msg = message.toString();
        this.mqttMessageReceived = msg.includes("Charger is connected");
      });
    },
    setupReevaluation() {
      setInterval(() => {
        this.evaluateSmartRecommendation();
      }, 15000);
    },
    loadGoogleMaps() {
      if (typeof window.google !== "undefined") {
        this.initMap();
      }
    },
    initMap() {
      this.map = new window.google.maps.Map(document.getElementById("map"), {
        center: { lat: -37.821, lng: 145.037 },
        zoom: 13,
      });
      this.directionsService = new window.google.maps.DirectionsService();
      this.directionsRenderer = new window.google.maps.DirectionsRenderer();
      this.directionsRenderer.setMap(this.map);
      this.geocoder = new window.google.maps.Geocoder();
      this.watchUserLocation();
    },
    watchUserLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.watchPosition(
          (position) => {
            this.userLocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            this.map.setCenter(this.userLocation);
            this.updateUserMarker();
            this.updateBatteryRangeCircle();
            this.evaluateSmartRecommendation();
            this.updateParkingMarkers(this.locations);
            this.reverseGeocodeUserLocation();
          },
          (error) => console.error("Geolocation failed: ", error)
        );
      }
    },
    reverseGeocodeUserLocation() {
      this.geocoder.geocode(
        { location: this.userLocation },
        (results, status) => {
          if (status === "OK" && results[0]) {
            this.userAddress = results[0].formatted_address;
          }
        }
      );
    },
    updateUserMarker() {
      if (this.userMarkerInstance) this.userMarkerInstance.setMap(null);
      this.userMarkerInstance = new window.google.maps.Marker({
        position: this.userLocation,
        map: this.map,
        icon: {
          url: userMarkerIcon,
          scaledSize: new window.google.maps.Size(40, 40),
        },
      });
    },
    updateBatteryRangeCircle() {
      if (!this.userLocation || this.batteryRange <= 0) return;
      if (this.batteryCircle) this.batteryCircle.setMap(null);
      this.batteryCircle = new window.google.maps.Circle({
        strokeColor: "#2196F3",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#2196F3",
        fillOpacity: 0.2,
        map: this.map,
        center: this.userLocation,
        radius: this.batteryRange * 1000,
      });
    },
    updateParkingMarkers(locations) {
      if (!this.userLocation) return;
      this.allMarkers.forEach((marker) => marker.setMap(null));
      if (this.markerCluster) this.markerCluster.clearMarkers();
      this.allMarkers = [];
      if (this.recommendedInfoWindow) {
  this.recommendedInfoWindow.close();
        this.recommendedInfoWindow = null;
        if (this.bestSpot) {
  const bestMarker = this.allMarkers.find(marker =>
    marker.getTitle()?.toLowerCase().includes(this.bestSpot.name.toLowerCase())
  );

  if (bestMarker) {
    const content = `
      <div style="font-weight: bold; color: green;">
        👑 Recommended Spot: ${this.bestSpot.name}<br/>
        Status: ${this.bestSpot.status}<br/>
        Price: $${this.bestSpot.price}<br/>
        Energy: ${this.bestSpot.energySource}<br/>
        Distance: ${this.bestSpot.distance} km<br/>
        Score: ${this.bestSpot.score}
      </div>`;

    this.recommendedInfoWindow = new window.google.maps.InfoWindow({ content });
    this.recommendedInfoWindow.open(this.map, bestMarker);
  }
}

}

      locations.forEach((location) => {
        const distance = this.calculateDistance(location.coords);
        location.distance = distance;

        if (this.batteryRange > 0 && distance > this.batteryRange) return;

        const isBest =
  this.bestSpot &&
  location.name.toLowerCase() === this.bestSpot.name.toLowerCase();


        const markerIcon = isBest
          ? crownIcon
          : location.status === "Available"
          ? greenMarker
          : redMarker;

        const score = this.calculateScore(location, distance);
        location.score = score;

        const marker = new window.google.maps.Marker({
          position: location.coords,
          icon: {
            url: markerIcon,
            scaledSize: new window.google.maps.Size(40, 40),
          },
          title: isBest
            ? `Recommended Spot: ${location.name}`
            : `Parking Spot: ${location.name}`,
        });

        const infoDiv = document.createElement("div");
        infoDiv.innerHTML = `
          <div>
            <strong>${isBest ? `Recommended Spot 👑: ${location.name}` : `Parking Spot: ${location.name}`}</strong><br/>
            Status: ${location.status}<br/>
            Distance: ${distance} km<br/>
            Price: $${location.price}<br/>
            Energy: ${location.energySource}<br/>
            Score: ${score}<br/>
          </div>`;

        if (location.status === "Available") {
          const startBtn = document.createElement("button");
          startBtn.innerText = "Start Route";
          startBtn.style.marginTop = "6px";
          startBtn.onclick = () => {
            if (location.energySource === "Natural Grid" || this.mqttMessageReceived) {
              this.$router.push({
                path: "/charging-status",
                query: {
                  location: location.name,
                  pricePerSecond: location.price,
                },
              });
            } else {
              alert("Please connect the charger to start charging.");
            }
          };
          infoDiv.appendChild(startBtn);
        }

        const infoWindow = new window.google.maps.InfoWindow({
          content: infoDiv,
        });

        marker.addListener("click", () => {
          infoWindow.open(this.map, marker);
        });

        this.allMarkers.push(marker);
      });

      this.markerCluster = new MarkerClusterer({
        map: this.map,
        markers: this.allMarkers,
        renderer: {
          render: ({ count, position }) => {
            const svg = `
              <svg xmlns='http://www.w3.org/2000/svg' width='60' height='60'>
                <circle cx='30' cy='30' r='28' fill='#2196F3' stroke='white' stroke-width='4'/>
                <text x='30' y='35' text-anchor='middle' font-size='20' fill='white' font-weight='bold'>${count}</text>
              </svg>`;
            return new google.maps.Marker({
              position,
              icon: {
                url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg),
                scaledSize: new window.google.maps.Size(45, 45),
              },
            });
          },
        },
      });
    },
    async evaluateSmartRecommendation() {
      if (!this.userLocation) return;

      try {
        const response = await fetch("http://localhost:3000/predict", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userLat: this.userLocation.lat,
            userLng: this.userLocation.lng,
            batteryLevel: this.batteryRange > 0 ? this.batteryRange : 5,

          }),
        });

        const data = await response.json();
        const { recommended, nextBest } = data;
        const validRecommendation = recommended && recommended.status === "Available"
          ? recommended
          : nextBest && nextBest.status === "Available"
          ? nextBest
          : null;
        this.bestSpot = validRecommendation;
        this.$emit("recommended-update", this.bestSpot);
        this.updateParkingMarkers(this.locations);
      } catch (error) {
        console.error("Prediction request failed:", error);
      }
    },
    calculateScore(loc, distance) {
      const priceScore = 1 - loc.price;
      const distanceScore = 1 / (distance + 0.1);
      const solarBonus = loc.energySource === "Solar" ? 1 : 0;
      return (
        priceScore * 0.4 +
        distanceScore * 0.4 +
        solarBonus * 0.2
      ).toFixed(3);
    },
    calculateRoute(destination) {
      if (!this.userLocation) return;
      const request = {
        origin: this.userLocation,
        destination,
        travelMode: window.google.maps.TravelMode.DRIVING,
        drivingOptions: {
          departureTime: new Date(),
          trafficModel: "bestguess",
        },
      };
      this.directionsService.route(request, (result, status) => {
        if (status === "OK") {
          this.directionsRenderer.setDirections(result);
        }
      });
    },
    calculateDistance(destinationCoords) {
      const toRad = (value) => (value * Math.PI) / 180;
      const [lat1, lon1] = [this.userLocation.lat, this.userLocation.lng];
      const [lat2, lon2] = [destinationCoords.lat, destinationCoords.lng];
      const R = 6371;
      const dLat = toRad(lat2 - lat1);
      const dLon = toRad(lon2 - lon1);
      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return parseFloat((R * c).toFixed(2));
    },
  },
};
</script>

<style>
.gm-style .gm-style-iw {
  overflow: visible !important;
  white-space: normal !important;
  max-height: none !important;
  max-width: none !important;
  width: auto !important;
  height: auto !important;
  margin-bottom: 20px;
  padding-bottom: 8px;
}

.gm-style .gm-style-iw-c {
  overflow: visible !important;
  padding-bottom: 20px;
}

.gm-style-iw-d {
  overflow: visible !important;
}

.gm-style .gm-style-iw button.gm-ui-hover-effect {
  top: 4px !important;
  right: 4px !important;
  background-color: transparent !important;
  border: none !important;
  box-shadow: none !important;
}

.gm-style .gm-style-iw-c::after {
  display: none !important;
}
</style>
