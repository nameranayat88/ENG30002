<template>
  <div class="parking-view">
    <h1 class="title">Parking Spots</h1>

    <!-- Filters Section -->
    <div class="filters">
      <label for="filterByDistance">Filter by Distance:</label>
      <select v-model="filterByDistance" id="filterByDistance">
        <option value="all">All</option>
        <option value="1">Within 1 km</option>
        <option value="5">Within 5 km</option>
        <option value="10">Within 10 km</option>
        <option value="20">Within 20 km</option>
      </select>

      <label for="sortByPrice">Sort by Price:</label>
      <select v-model="sortByPrice" id="sortByPrice">
        <option value="low-to-high">Low to High</option>
        <option value="high-to-low">High to Low</option>
      </select>

      <label for="filterByEnergy">Filter by Energy Source:</label>
      <select v-model="filterByEnergy" id="filterByEnergy">
        <option value="all">All</option>
        <option value="Solar">Solar</option>
        <option value="Natural Grid">Natural Grid</option>
      </select>
    </div>

    <!-- Map and List -->
    <div class="map-container">
      <GoogleMap
  :locations="filteredLocations"
  :batteryRange="batteryRange"
  :bestSpot="bestSpot"
  @recommended-update="handleRecommendation"
/>
    </div>

    <SpotsPage
      :filteredLocations="filteredLocations"
      :recommendedSpot="bestSpot"
      :mqttConnected="mqttMessageReceived"
    />
  </div>
</template>

<script>
import SpotsPage from "@/components/SpotsPage.vue";
import mqtt from "mqtt";
import parkingLocations from "@/data/mockparkingLocations";
import GoogleMap from "@/components/GoogleMap.vue";

export default {
  name: "ParkingView",
  components: { GoogleMap, SpotsPage },
  data() {
    return {
      parkingLocations: [...parkingLocations],
      filterByDistance: "all",
      sortByPrice: "low-to-high",
      filterByEnergy: "all",
      batteryRange: 0,
      filteredLocations: [],
      bestSpot: null, // ✅ FIXED here
      client: null,
      mqttMessageReceived: false,
    };
  },
  created() {
    this.updateFilteredLocations();
    this.connectToMQTT();
    this.startStatusSimulation();
  },
  watch: {
    filterByDistance: "updateFilteredLocations",
    sortByPrice: "updateFilteredLocations",
    filterByEnergy: "updateFilteredLocations",
  },
  methods: {
    updateFilteredLocations() {
      let filtered = [...this.parkingLocations];

      if (this.filterByEnergy !== "all") {
        filtered = filtered.filter(
          (loc) => loc.energySource === this.filterByEnergy
        );
      }

      if (this.filterByDistance !== "all") {
        const limit = parseFloat(this.filterByDistance);
        filtered = filtered.filter((loc) => loc.distance <= limit);
      }

      filtered.sort((a, b) => {
        return this.sortByPrice === "low-to-high"
          ? a.price - b.price
          : b.price - a.price;
      });

      // 👑 Ensure recommended spot is always included
      if (
        this.bestSpot &&
        !filtered.find((loc) => loc.name === this.bestSpot.name)
      ) {
        filtered.unshift(this.bestSpot);
      }

      this.filteredLocations = filtered;
    },

    connectToMQTT() {
      this.client = mqtt.connect("wss://broker.emqx.io:8084/mqtt");
      this.client.on("connect", () => {
        console.log("Connected to MQTT broker");
        this.client.subscribe("myTopic/sensor", (err) => {
          if (!err) console.log("Subscribed to topic");
        });
      });

      this.client.on("message", (topic, message) => {
        const msg = message.toString();
        this.mqttMessageReceived = msg.includes("Charger is connected");
      });
    },

    startStatusSimulation() {
      setInterval(() => {
        this.parkingLocations = this.parkingLocations.map((location) => {
          const random = Math.random();
          const newStatus =
            random > 0.5
              ? location.status === "Available"
                ? "Occupied"
                : "Available"
              : location.status;

          return { ...location, status: newStatus };
        });

        this.updateFilteredLocations();
      }, 30000);
    },

    handleRecommendation(spot) {
      this.bestSpot = spot;
      console.log("✅ Recommended spot received:", spot?.name);
    },
  },
  beforeUnmount() {
    if (this.client) this.client.end();
  },
};
</script>

<style scoped>
.parking-view {
  padding: 20px;
}
.filters {
  text-align: center;
  margin: 20px;
}
.filters label {
  margin: 10px;
  padding: 10px;
}
.battery-input {
  margin-top: 15px;
}
</style>
