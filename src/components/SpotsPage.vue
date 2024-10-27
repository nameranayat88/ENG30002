//src/components/SpotsPage.vue
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
        <tr v-for="location in filteredLocations" :key="location.name">
          <td>{{ location.name }}</td>
          <td>{{ location.status }}</td>
          <td>{{ location.distance ? location.distance + ' km' : 'N/A' }}</td>
          <td>${{ location.price }}</td>
          <td>{{ location.energySource }}</td>
          <td>
            <button v-if="location.status === 'available'" @click="startParking(location)">
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
  },
  data() {
    return {
      isCharging: false,
      currentSpot: null,
      client: null, // MQTT client instance
      mqttMessageReceived: false, // Flag to check if charger is connected
    };
  },
  mounted() {
    this.connectToMQTT(); // Connect to MQTT on load
  },
  methods: {
    startParking(location) {
      if (location.energySource === 'Natural Grid') {
        this.redirectToChargingStatus(location); // Redirect to Charging Status for Natural Grid
      } else if (location.energySource === 'Solar') {
        if (this.mqttMessageReceived) {
          this.redirectToChargingStatus(location); // Redirect to Charging Status for Solar if connected
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
        if (msg.includes('Charger is connected')) {
          this.mqttMessageReceived = true;
        } else if (msg.includes('Charger not connected')) {
          this.mqttMessageReceived = false;
        }
      });
    }
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
</style>
