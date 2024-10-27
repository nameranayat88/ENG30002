<template>
  <div id="map" style="width: 100%; height: 500px;"></div>
</template>

<script>
import greenMarker from '@/assets/green-marker.png'; // Green marker for available
import redMarker from '@/assets/red-marker.png';     // Red marker for occupied

export default {
  name: 'GoogleMap',
  props: {
    locations: {
      type: Array,
      default: () => []  // Default empty array if no locations are passed
    }
  },
  mounted() {
    this.loadGoogleMaps();  // Load Google Maps when the component is mounted
  },
  watch: {
    locations: {
      handler() {
        this.initMap();  // Re-initialize the map when locations change
      },
      deep: true
    }
  },
  methods: {
    loadGoogleMaps() {
      if (typeof window.google !== 'undefined') {
        this.initMap();
      } else {
        window.initMap = this.initMap;
      }
    },
    initMap() {
      const map = new window.google.maps.Map(document.getElementById('map'), {
        center: { lat: -37.821, lng: 145.037 }, // Center the map
        zoom: 15
      });

      if (this.locations && this.locations.length) {
        this.locations.forEach(location => {
          const markerIcon = location.status === 'Available' ? greenMarker : redMarker;

          const marker = new window.google.maps.Marker({
            position: location.coords,
            map: map,
            icon: {
              url: markerIcon,
              scaledSize: new window.google.maps.Size(40, 40)  // Adjust size as needed
            }
          });

          const infoWindow = new window.google.maps.InfoWindow({
            content: `<div><strong>${location.name}</strong><br>Status: ${location.status}</div>`
          });

          marker.addListener('click', () => {
            infoWindow.open(map, marker);
          });
        });
      }
    }
  }
};
</script>

<style scoped>
#map {
  width: 100%;
  height: 500px;
}
</style>
