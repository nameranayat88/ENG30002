<template>
  <section class="hero">
    <div class="hero-overlay"></div> <!-- Dark overlay to make text more readable -->
    <div class="hero-content">
      <h1 class="hero-title">Effortless Parking and EV Charging</h1>
      <p class="hero-description">Find parking spots and charging stations in real-time, anytime.</p>
      <router-link to="/spots" class="btn btn-primary">Find Parking</router-link>
      <!-- Register button shown only when not authenticated -->
      <router-link v-if="!isAuthenticated" to="/register" class="btn btn-secondary">Register Now</router-link>
    </div>
  </section>
</template>

<script>
import { getAuth } from "firebase/auth";

export default {
  name: "HeroSection",
  data() {
    return {
      isAuthenticated: false, // Track if user is authenticated
    };
  },
  mounted() {
    this.checkAuthState();
  },
  methods: {
    checkAuthState() {
      const auth = getAuth();
      auth.onAuthStateChanged((user) => {
        this.isAuthenticated = !!user; // Update the isAuthenticated flag based on user status
      });
    },
  },
};
</script>

<style scoped>
.hero {
  position: relative;
  width: 100%;
  background-image: url('https://images.pexels.com/photos/164634/pexels-photo-164634.jpeg'); /* Use a high-quality image URL */
  background-size: cover; /* Ensure the image covers the entire hero section */
  background-position: center; /* Center the background image */
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: white;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* Dark overlay to increase text readability */
  z-index: 1;
}

.hero-content {
  position: relative;
  z-index: 2;
  padding: 20px;
}

.hero-title {
  font-size: 2.5rem; /* Adjusted for better readability */
  color: #fff;
  font-family: 'Montserrat', sans-serif; /* Clean, modern font */
  font-weight: bold;
  margin-bottom: 20px;
}

.hero-description {
  font-size: 1.2rem; /* Slightly reduced for balance */
  margin-bottom: 40px;
  max-width: 800px;
}

.btn-primary {
  padding: 15px 30px;
  background-color: #23b044; /* Mint for the CTA button */
  color: white;
  font-size: 1.5rem;
  border: none;
  border-radius: 5px;
  text-decoration: none;
  transition: background-color 0.3s ease;
  z-index: 3;
}

.btn-secondary {
  padding: 15px 30px;
  background-color: #0ca8b0; /* Mint for the CTA button */
  color: white;
  font-size: 1.5rem;
  border: none;
  border-radius: 5px;
  text-decoration: none;
  transition: background-color 0.3s ease;
  z-index: 3;
}

.btn-primary:hover {
  background-color: #044f3a; /* Darker shade for hover effect */
}

.btn-secondary:hover {
  background-color: #1e5094; /* Darker shade for hover effect */
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem; /* Smaller title for mobile */
  }

  .hero-description {
    font-size: 1rem; /* Smaller description for mobile */
  }

  .btn-primary {
    font-size: 1.25rem; /* Smaller button on mobile */
  }
}
</style>
