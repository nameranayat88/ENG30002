<template>
  <div class="parking-list">
    <h3>Parking Spot Status:</h3>

    <table class="parking-table">
      <thead>
        <tr>
          <th>Parking Spot</th>
          <th>Status</th>
          <th>Distance (km)</th>
          <th>Price / per minute</th>
          <th>Energy Source</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <!-- Highlighted Recommended Spot -->
        <tr
          v-if="recommendedSpot"
          class="highlight"
          :key="recommendedSpot.name + '-recommended'"
        >
          <td>👑 {{ recommendedSpot.name }}</td>
          <td>{{ recommendedSpot.status }}</td>
          <td>{{ recommendedSpot.distance ? recommendedSpot.distance + ' km' : 'N/A' }}</td>
          <td>${{ recommendedSpot.price }}</td>
          <td>{{ recommendedSpot.energySource }}</td>
          <td>
            <button
              v-if="recommendedSpot.status === 'Available'"
              @click="startParking(recommendedSpot)"
            >
              Start Charging
            </button>
          </td>
        </tr>

        <!-- Other Spots -->
        <tr
          v-for="location in otherLocations"
          :key="location.name"
        >
          <td>{{ location.name }}</td>
          <td>{{ location.status }}</td>
          <td>{{ location.distance ? location.distance + ' km' : 'N/A' }}</td>
          <td>${{ location.price }}</td>
          <td>{{ location.energySource }}</td>
          <td>
            <button
              v-if="location.status === 'Available'"
              @click="startParking(location)"
            >
              Start Charging
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import mqtt from 'mqtt';

export default {
  name: "SpotsPage",
  props: {
    filteredLocations: {
      type: Array,
      required: true,
    },
    recommendedSpot: {
      type: Object,
      default: null,
    }
  },
  data() {
    return {
      client: null,
      mqttMessageReceived: false,
    };
  },
  computed: {
    otherLocations() {
      if (!this.recommendedSpot) return this.filteredLocations;
      return this.filteredLocations.filter(
        loc => loc.name !== this.recommendedSpot.name
      );
    }
  },
  mounted() {
    this.connectToMQTT();
  },
  methods: {
    startParking(location) {
      if (location.energySource === 'Natural Grid') {
        this.redirectToChargingStatus(location);
      } else if (location.energySource === 'Solar') {
        if (this.mqttMessageReceived) {
          this.redirectToChargingStatus(location);
        } else {
          alert("Please connect the charger to start charging.");
        }
      }
    },
    redirectToChargingStatus(location) {
      this.$router.push({
        path: '/charging-status',
        query: {
          location: location.name,
          pricePerSecond: location.price,
        },
      });
    },
    connectToMQTT() {
      this.client = mqtt.connect('wss://broker.emqx.io:8084/mqtt');
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
        this.mqttMessageReceived = msg.includes('Charger is connected');
      });
    }
  },
  beforeUnmount() {
    if (this.client) this.client.end();
  }
};
</script>

<style scoped>
.parking-list {
  margin-top: 20px;
}

.parking-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.parking-table th,
.parking-table td {
  padding: 12px 15px;
  border: 1px solid #004346;
  text-align: left;
}

.parking-table th {
  background-color: #a2f1b2;
  font-weight: bold;
}

.highlight {
  background-color: #f8ffbd;
  font-weight: bold;
}
</style>
