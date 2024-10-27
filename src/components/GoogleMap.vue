<template>
  <div id="map" style="width: 100%; height: 400px"></div>
</template>

<script>
import greenMarker from "@/assets/green-marker.png"; // Green marker for available
import redMarker from "@/assets/red-marker.png"; // Red marker for occupied
import userMarkerIcon from "@/assets/user-marker.png"; // Custom marker for user location

export default {
  name: "GoogleMap",
  props: {
    locations: {
      type: Array,
      default: () => [], // Default empty array if no locations are passed
    },
  },
  data() {
    return {
      userLocation: null, // Store user's location
      userAddress: "", // Store user's address
      map: null, // Store the map instance
      directionsService: null,
      directionsRenderer: null,
      userMarkerInstance: null, // Store the user marker instance to avoid duplicates
      geocoder: null, // Geocoding service to get address from coordinates
    };
  },
  mounted() {
    this.loadGoogleMaps(); // Load Google Maps when the component is mounted
  },
  methods: {
    loadGoogleMaps() {
      if (typeof window.google !== "undefined") {
        this.initMap();
      }
    },
    initMap() {
      this.map = new window.google.maps.Map(document.getElementById("map"), {
        center: { lat: -37.821, lng: 145.037 }, // Center the map in Melbourne
        zoom: 13,
      });

      this.directionsService = new window.google.maps.DirectionsService();
      this.directionsRenderer = new window.google.maps.DirectionsRenderer();
      this.directionsRenderer.setMap(this.map);

      this.geocoder = new window.google.maps.Geocoder();
      this.watchUserLocation(); // Watch user's location
    },
    // Watch user's location continuously
    watchUserLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.watchPosition(
          (position) => {
            this.userLocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            this.map.setCenter(this.userLocation); // Center the map on user's location
            this.updateUserMarker(); // Update user marker
            this.updateParkingMarkers(this.locations); // Recalculate distances for parking spots
            this.reverseGeocodeUserLocation(); // Get user's address
          },
          (error) => {
            console.error("Geolocation failed: ", error);
            this.map.setCenter(this.userLocation);
            this.updateUserMarker();
            this.updateParkingMarkers(this.locations);
            this.reverseGeocodeUserLocation();
          },
          {
            enableHighAccuracy: false, // Set to false for faster and less power-consuming results
            maximumAge: 60000, // Use cached location if available within the last 60 seconds
            timeout: 10000, // Shorten timeout to 10 seconds for quicker results
          }
        );
      }
    },

    reverseGeocodeUserLocation() {
      this.geocoder.geocode(
        { location: this.userLocation },
        (results, status) => {
          if (status === "OK") {
            if (results[0]) {
              this.userAddress = results[0].formatted_address;
            }
          }
        }
      );
    },
    // Update user marker position dynamically
    updateUserMarker() {
      if (this.userMarkerInstance) {
        this.userMarkerInstance.setMap(null); // Remove existing marker
      }
      this.userMarkerInstance = new window.google.maps.Marker({
        position: this.userLocation,
        map: this.map,
        icon: {
          url: userMarkerIcon,
          scaledSize: new window.google.maps.Size(40, 40),
        },
      });

      const infoWindow = new window.google.maps.InfoWindow({
        content: `<div><strong>Your Location</strong><br>${this.userAddress}</div>`,
      });
      this.userMarkerInstance.addListener("click", () => {
        infoWindow.open(this.map, this.userMarkerInstance);
      });
    },
    updateParkingMarkers(locations) {
      locations.forEach((location) => {
        const markerIcon =
          location.status === "available" ? greenMarker : redMarker;

        const marker = new window.google.maps.Marker({
          position: location.coords,
          map: this.map,
          icon: {
            url: markerIcon,
            scaledSize: new window.google.maps.Size(40, 40),
          },
        });

        const distance = this.calculateDistance(location.coords);
        location.distance = distance; // Store the calculated distance in the location object

        const infoWindow = new window.google.maps.InfoWindow({
          content: `<div>
        <strong>${location.name}</strong><br>
        Status: ${location.status}<br>
        Distance: ${distance} km<br>
        Price: $${location.price}<br>
        Energy Source: ${location.energySource}
      </div>`,
        });

        marker.addListener("click", () => {
          infoWindow.open(this.map, marker);
          this.calculateRoute(location.coords); // Calculate route from user to parking spot
        });
      });
    },

    calculateRoute(destination) {
      if (!this.userLocation) return;

      const request = {
        origin: this.userLocation,
        destination: destination,
        travelMode: window.google.maps.TravelMode.DRIVING,
      };

      this.directionsService.route(request, (result, status) => {
        if (status === "OK") {
          this.directionsRenderer.setDirections(result);
        }
      });
    },
    calculateDistance(destinationCoords) {
      if (!this.userLocation) return "N/A";

      // Use the Haversine formula to calculate the distance in kilometers
      const toRad = (value) => (value * Math.PI) / 180; // Convert degrees to radians

      const lat1 = this.userLocation.lat;
      const lon1 = this.userLocation.lng;
      const lat2 = destinationCoords.lat;
      const lon2 = destinationCoords.lng;

      const R = 6371; // Radius of the Earth in kilometers
      const dLat = toRad(lat2 - lat1);
      const dLon = toRad(lon2 - lon1);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) *
          Math.cos(toRad(lat2)) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

      const distance = R * c; // Distance in kilometers
      return distance.toFixed(2); // Return the distance rounded to 2 decimal places
    },
  },
};
</script>

<style scoped>
#map {
  border: solid 3px;
  padding: 1em;
  max-width: 75%;
  display: grid;
  margin-left: auto;
  margin-right: auto;
  place-items: center;
}
</style>
