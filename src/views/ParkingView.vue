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

    <!-- Google Map with parking locations -->
    <div class="map-container">
      <GoogleMap :locations="filteredLocations" />
    </div>

    <!-- Pass filtered data to SpotsPage -->
    <SpotsPage :filteredLocations="filteredLocations" :mqttConnected="mqttMessageReceived" />
  </div>
</template>

<script>
import GoogleMap from "@/components/GoogleMap.vue";
import SpotsPage from "@/components/SpotsPage.vue";
import mqtt from 'mqtt';

export default {
  name: "ParkingView",
  components: { GoogleMap, SpotsPage },
  data() {
    return {
      parkingLocations: [
        {
          name: "Swinburne Car Park",
          coords: { lat: -37.820717870866375, lng: 145.03786293862672 },
          status: "available",
          price: 0.23,
          energySource: "Solar",
          distance: null, // distance in km
        },
        {
          name: "CBD Car Park",
          coords: { lat: -37.80790996494552, lng: 144.9680209676525 },
          status: "available",
          price: 0.45,
          energySource: "Natural Grid",
          distance: null, // distance in km
        },
        {
          name: "Clayton Car Park",
          coords: { lat: -37.907553985228446, lng: 145.13592985617817 },
          status: "occupied",
          price: 0.20,
          energySource: "Solar",
          distance: null, // distance in km
        },
      ],
      filterByDistance: "all", // Filter by distance
      sortByPrice: "low-to-high",
      filterByEnergy: "all",
      filteredLocations: [], // Initialize filtered locations
      client: null, // MQTT client instance
      mqttMessageReceived: false, // MQTT flag to check if charger is connected
    };
  },
  created() {
    this.updateFilteredLocations(); // Initialize the filteredLocations on load
    this.connectToMQTT(); // Connect to MQTT on component creation
  },
  watch: {
    filterByDistance() {
      this.updateFilteredLocations();
    },
    sortByPrice() {
      this.updateFilteredLocations();
    },
    filterByEnergy() {
      this.updateFilteredLocations();
    },
  },
  methods: {
    updateFilteredLocations() {
      let filteredLocations = [...this.parkingLocations];

      // Filter by energy source
      if (this.filterByEnergy !== "all") {
        filteredLocations = filteredLocations.filter(
          (location) => location.energySource === this.filterByEnergy
        );
      }

      // Filter by distance range
      if (this.filterByDistance !== "all") {
        const distanceLimit = parseFloat(this.filterByDistance); // Convert to number
        filteredLocations = filteredLocations.filter(
          (location) => location.distance <= distanceLimit
        );
      }

      // Sort by price
      if (this.sortByPrice === "low-to-high") {
        filteredLocations.sort((a, b) => a.price - b.price);
      } else if (this.sortByPrice === "high-to-low") {
        filteredLocations.sort((a, b) => b.price - a.price);
      }

      this.filteredLocations = filteredLocations;
    },

    // MQTT Connection setup
    connectToMQTT() {
      this.client = mqtt.connect('wss://broker.emqx.io:8084/mqtt'); // Connect to MQTT using WebSocket

      this.client.on('connect', () => {
        console.log('Connected to MQTT broker');
        this.client.subscribe('myTopic/sensor', (err) => {
          if (!err) {
            console.log('Subscribed to topic: myTopic/sensor');
          }
        });
      });

      this.client.on('message', (topic, message) => {
        const msg = message.toString();
        console.log(`Received message: ${msg} from topic: ${topic}`);

        // Check if the charger is connected via MQTT messages
        if (msg.includes('Charger is connected')) {
          this.mqttMessageReceived = true;
        } else if (msg.includes('Charger not connected')) {
          this.mqttMessageReceived = false;
        }
      });
    }
  },
  beforeUnmount() {
    if (this.client) {
      this.client.end(); // Disconnect MQTT when component is destroyed
    }
  }
};
</script>

<style scoped>
.parking-view {
  padding: 20px;
}

.filters {
  text-align: center;
  margin: 20px;
  width: auto;
}

.filters label {
  margin: 10px;
  padding: 10px;
}
</style>
