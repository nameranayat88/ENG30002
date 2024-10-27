<template>
  <nav class="navbar navbar-expand-lg">
    <div class="container-fluid">

      <!-- Logo or Home Link -->
      <!-- Apply disabled class to the logo when disableNavbar is true -->
      <router-link :to="disableNavbar ? null : '/'" class="navbar-brand" :class="{ disabled: disableNavbar }" href="#">
        Smart Parking
      </router-link>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
        <ul class="navbar-nav align-items-center">
          <!-- Parking & EV Charging link (Only when authenticated) -->
          <li class="nav-item" v-if="isAuthenticated">
            <router-link class="nav-link" :class="{ disabled: disableNavbar }" to="/spots">
              <i class="fas fa-car"></i> Parking & EV Charging
            </router-link>
          </li>

          <!-- Login/Register and Logout links -->
          <li class="nav-item d-flex">
            <!-- Show login/register if not authenticated -->
            <router-link v-if="!isAuthenticated" class="nav-link" :class="{ disabled: disableNavbar }" to="/login">
              <i class="fas fa-lock"></i> Login
            </router-link>
            <router-link v-if="!isAuthenticated" class="nav-link" :class="{ disabled: disableNavbar }" to="/register" style="margin-left: 15px;">
              <i class="fas fa-user-plus"></i> Register
            </router-link>
            <!-- Show logout if authenticated -->
            <a v-if="isAuthenticated" class="nav-link" :class="{ disabled: disableNavbar }" href="#" @click="logout">
              <i class="fas fa-sign-out-alt"></i> Logout
            </a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import { getAuth, signOut } from "firebase/auth";

export default {
  data() {
    return {
      isAuthenticated: false, // Track if user is authenticated
    };
  },
  mounted() {
    this.checkAuthState(); // Check user authentication state
  },
  methods: {
    checkAuthState() {
      const auth = getAuth();
      auth.onAuthStateChanged((user) => {
        this.isAuthenticated = !!user; // Update the authenticated state
      });
    },
    logout() {
      const auth = getAuth();
      signOut(auth).then(() => {
        this.isAuthenticated = false;
        this.$router.push("/login");
      });
    }
  },
  computed: {
    disableNavbar() {
      // Disable navbar if the user is on payment or charging status page
      return this.$route.path === "/payment" || this.$route.path === "/charging-status";
    }
  }
};
</script>

<style scoped>
.navbar-nav {
  display: flex;
  gap: 15px; /* Add spacing between links */
}

.navbar-brand {
  font-size: 1.5rem;
  font-weight: bold;
}

.navbar-brand.disabled {
  pointer-events: none; 
  color: #bef7f7; 
  opacity: 0.6; 
}

.nav-link {
  display: flex;
  align-items: center;
}

.nav-link i {
  margin-right: 5px; 
}

.nav-item.d-flex {
  display: flex;
  align-items: center;
}

.disabled {
  pointer-events: none;
  color: #bef7f7;
  opacity: 0.6;
}
</style>
