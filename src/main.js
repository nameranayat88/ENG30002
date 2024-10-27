//src/main.js
import { createApp } from 'vue';  // Vue 3 syntax
import App from './App.vue';
import router from './router';  // Import the router from the separate file
import './assets/global.css'; // Assuming this is your global CSS file


const app = createApp(App);

app.use(router);  // Use the router with the app
app.mount('#app');  // Mount the app
