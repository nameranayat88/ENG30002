// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import ParkingView from '@/views/ParkingView.vue';
import PaymentView from '@/views/PaymentView.vue';
import GoogleMap from '@/components/GoogleMap.vue';
import ChargingStatus from '@/components/ChargingStatus.vue';
import Login from '@/components/Login.vue'; // Import Login
import Register from '@/components/Register.vue'; // Import Register
import { getAuth } from "firebase/auth";  // Import Firebase auth

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/map', name: 'map', component: GoogleMap },
  { path: '/spots', name: 'spots', component: ParkingView, meta: { requiresAuth: true } }, // Protect this route
  { path: '/payment', name: 'payment', component: PaymentView, meta: { requiresAuth: true } }, // Protect this route
  { path: '/charging-status', name: 'charging-status', component: ChargingStatus, meta: { requiresAuth: true } }, // Protect this route
  { path: '/login', name: 'login', component: Login }, // Public route
  { path: '/register', name: 'register', component: Register }, // Public route
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Route guard to check for authentication
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const auth = getAuth();  // Get Firebase Auth instance
  const currentUser = auth.currentUser;  // Check if user is authenticated

  if (requiresAuth && !currentUser) {
    next('/login');  // Redirect to login page if user is not authenticated
  } else {
    next();  // Proceed to the requested route
  }
});

export default router;
