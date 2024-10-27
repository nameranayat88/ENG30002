//src/components/Login.vue
<template>
  <div class="login">
    <h1>Login</h1>
    <form @submit.prevent="loginUser">
      <div class="form-group">
        <label for="email">Email:</label>
        <input
          type="email"
          v-model="email"
          required
          placeholder="Enter your email"
          class="form-control"
        />
      </div>

      <div class="form-group">
        <label for="password">Password:</label>
        <input
          type="password"
          v-model="password"
          required
          placeholder="Enter your password"
          class="form-control"
        />
      </div>

      <div class="form-group">
        <button type="submit" class="btn btn-primary">Login</button>
      </div>

      <p>
        Don't have an account?
        <router-link to="/register">Register here</router-link>
      </p>

      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </form>
  </div>
</template>

<script>
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase";  // Import Firebase Auth

export default {
  data() {
    return {
      email: "",
      password: "",
      errorMessage: "",
    };
  },
  methods: {
    async loginUser() {
      try {
        const auth = getAuth();
        await signInWithEmailAndPassword(auth, this.email, this.password);
        this.$router.push("/"); // Redirect to homepage after login
      } catch (error) {
        this.errorMessage = error.message;
      }
    },
  },
};
</script>

<style scoped>
.login {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
}

.error {
  color: red;
  margin-top: 10px;
}
</style>
