<template>
  <div class="charging-status">
    <h1>Charging Status</h1>

    <div class="charging-info">
      <h3><i class="fas fa-map-marker-alt"></i> Location: {{ currentSpot }}</h3>
      <h3><i class="fas fa-clock"></i> Time Elapsed: {{ timeElapsed }} second<span v-if="timeElapsed > 1">s</span></h3>
      <h3><i class="fas fa-dollar-sign"></i> Total Cost: ${{ totalPrice.toFixed(2) }}</h3>
      
      <!-- Progress Bar -->
      <div class="progress-container">
        <div class="progress-bar" role="progressbar" :style="{ width: (timeElapsed % 60) + '%' }">
          {{ (timeElapsed % 60) }}%
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import mqtt from 'mqtt';

export default {
  data() {
    return {
      currentSpot: this.$route.query.location || "Unknown Location",
      timeElapsed: 0, // Time elapsed in seconds
      pricePerMinute: parseFloat(this.$route.query.pricePerMinute) || 0.23, // Default price per minute
      pricePerSecond: 0, // Price per second will be calculated
      totalPrice: 0, // Total price will accumulate
      chargingInterval: null,
      client: null, // MQTT client
      mqttMessageReceived: true, // Assume the charger is connected at the start
    };
  },
  mounted() {
    this.pricePerSecond = this.pricePerMinute / 60; // Calculate price per second based on price per minute
    this.beginCharging(); // Start charging and time tracking
    this.connectToMQTT(); // Connect to the MQTT broker
  },
  methods: {
    beginCharging() {
      this.chargingInterval = setInterval(() => {
        this.timeElapsed++; // Increment time elapsed by 1 second
        this.totalPrice += this.pricePerSecond; // Increment total price based on price per second
      }, 1000); // 1000ms = 1 second
    },

    connectToMQTT() {
      this.client = mqtt.connect('wss://broker.emqx.io:8084/mqtt'); // Connect to MQTT broker

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

        if (msg.includes('Charger is connected')) {
          this.mqttMessageReceived = true; // Charger connected, continue charging
        } else if (msg.includes('Charger not connected')) {
          this.mqttMessageReceived = false; // Charger disconnected, stop charging
          this.finishCharging(); // Automatically finish charging and redirect
        }
      });
    },

    finishCharging() {
      clearInterval(this.chargingInterval); // Stop charging
      const finalCost = this.totalPrice.toFixed(2); // Calculate final cost
      this.client.end(); // Disconnect from MQTT
      this.$router.push({ path: '/payment', query: { totalCost: finalCost } }); // Redirect to payment page
    }
  },
  beforeUnmount() {
    clearInterval(this.chargingInterval); // Clean up interval when the component is destroyed
    if (this.client) {
      this.client.end(); // Disconnect MQTT
    }
  }
};
</script>

<style scoped>
/* Adjust container padding for the card and general layout */
.charging-status {
  padding: 20px;
  margin: 40px auto;
  text-align: center;
  width: 80%;
}

/* Charging Info Styling */
.charging-info {
  margin-bottom: 40px;
  color: #004346;
  padding: 20px;
  text-align: center;
}

/* Progress bar container with a black border for better visibility */
.progress-container {
  width: 80%;
  margin: 20px auto;
  background-color: #dde2e2;
  border-radius: 8px;
  border: 2px solid #004346; /* Black border added */
  position: relative;
  height: 30px;
  overflow: hidden;
}

/* Deeper color for progress */
.progress-bar {
  height: 100%;
  background-color: #77e15c;
  color: black;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
}

button {
  margin: 20px;
  transition: transform 0.2s;
}

button:hover {
  transform: translateY(-2px);
}
</style>
