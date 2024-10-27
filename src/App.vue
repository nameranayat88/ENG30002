<template>
  <div id="app">
    <Navbar /> <!-- Navbar at the top -->
    <div class="content">
      <router-view /> <!-- Dynamic content goes here -->
    </div>
    <FooterComponent /> <!-- Footer always at the bottom -->
  </div>
</template>

<script>
import Navbar from './components/NavbarComponent.vue';  // Navbar import
import FooterComponent from './components/FooterComponent.vue';  // Footer import

export default {
  name: 'App',
  components: {
    Navbar,
    FooterComponent
  }
};
</script>

<style>
#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh; /* Ensure the app takes full viewport height */
}

.content {
  flex: 1; /* Allow content to grow, pushing the footer to the bottom */
}

/* Import your global styles if needed */
@import './assets/global.css';
</style>
