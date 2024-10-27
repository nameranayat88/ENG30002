<template>
  <div class="home-view">
    <!-- Welcome Heading and Description -->
    <h1>Welcome to the Smart Parking System</h1>
    <p>
      Your solution for finding parking spots and charging stations in real
      time!
    </p>

    <!-- Hero Section -->
    <HeroSection />

    <!-- Benefits/Features Section -->
    <section class="features-section">
      <h2>Key Features</h2>
      <div class="features-container">
        <div class="feature-card">
          <i class="fas fa-car"></i>
          <!-- Icon for parking availability -->
          <h3>Real-Time Parking Availability</h3>
          <p>
            Access live data on parking spots and reserve a spot before you
            arrive, saving time.
          </p>
        </div>

        <div class="feature-card">
          <i class="fas fa-charging-station"></i>
          <!-- Icon for EV charging -->
          <h3>EV Charging Stations</h3>
          <p>
            Find nearby EV charging stations, with detailed availability for
            your next charge.
          </p>
        </div>

        <div class="feature-card">
          <i class="fas fa-lock"></i>
          <!-- Icon for secure payments -->
          <h3>Secure Payments</h3>
          <p>
            Make fast, secure payments for parking and EV charging, with
            multiple options supported.
          </p>
        </div>
      </div>
    </section>

    <!-- Testimonials Section -->
    <section class="testimonials-section">
      <h2>What Our Users Are Saying</h2>
      <div class="testimonials-container">
        <div class="testimonial-card">
          <p>
            "This app makes parking so much easier! I love the real-time
            updates."
          </p>
          <h4>Jane Hopper</h4>
          <span>★★★★</span>
          <!-- Placeholder for star rating -->
        </div>
        <div class="testimonial-card">
          <p>
            "A game-changer for EV drivers! Finding charging stations has never
            been this simple."
          </p>
          <h4>Sam Owens</h4>
          <span>★★★★★</span>
          <!-- Placeholder for star rating -->
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import HeroSection from "@/components/HeroSection.vue"; // Hero section import

export default {
  name: "HomeView",
  components: {
    HeroSection,
  },
};
</script>

<style scoped>
/* HomeView Styling */
.home-view {
  text-align: center;
  margin-top: 50px; /* Adjust margin if needed */
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 10px;
  color: #172a3a; /* Prussian Blue */
}

p {
  font-size: 1.5rem;
  margin: 20px;
  text-align: center;
  color: #0a5761; /* Dark Slate Gray */
}

/* Features Section Styling */
.features-section {
  padding: 40px;
  background-color: #172a3a;
  text-align: center;
}

.features-section h2 {
  font-size: 3rem;
  margin: 30px;
  color: #ffffff;
}

.features-container {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 30px;
}

.feature-card {
  background-color: #b4e8cf;
  border-radius: 8px;
  padding: 20px;
  width: 350px;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.feature-card i {
  font-size: 2rem;
  margin-bottom: 10px;
  color: #32747d; /* Caribbean Current */
}

.feature-card h3 {
  margin-bottom: 10px;
  color: #004346;
}

/* Testimonials Section Styling */
.testimonials-section {
  padding: 40px;
  background-color: #bef7e7;
  text-align: center;
}

.testimonials-section h2 {
  font-size: 2rem;
  margin-bottom: 30px;
  color: #172a3a;
}

.testimonials-container {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 20px;
}

.testimonial-card {
  background-color: #f5f5f5;
  border-radius: 8px;
  padding: 20px;
  width: 300px;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.testimonial-card p {
  font-style: italic;
}

.testimonial-card h4 {
  margin-top: 20px;
  color: #004346; /* Midnight Green */
}

.testimonial-card span {
  font-size: 1.5rem;
  color: #09bc8a; /* Mint */
}
</style>
