//src/components/Register.vue
<template>
  <div class="register">
    <h1>Register</h1>
    <form @submit.prevent="registerUser">
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
        <label for="phoneNumber">Phone Number:</label>
        <input
          type="text"
          v-model="phoneNumber"
          required
          placeholder="Enter your phone number"
          class="form-control"
        />
      </div>

      <div class="form-group">
        <label for="rego">Car Registration Number:</label>
        <input
          type="text"
          v-model="rego"
          required
          placeholder="Enter your car registration number"
          class="form-control"
        />
      </div>

      <div class="form-group">
        <button type="submit" class="btn btn-primary">Register</button>
      </div>

      <p>
        Already have an account?
        <router-link to="/login">Login here</router-link>
      </p>

      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </form>
  </div>
</template>

<script>
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/firebase";  // Import Firebase Auth and Firestore

export default {
  data() {
    return {
      email: "",
      password: "",
      phoneNumber: "",
      rego: "",
      errorMessage: "",
    };
  },
  methods: {
    async registerUser() {
      try {
        const auth = getAuth();
        const firestore = getFirestore();
        const userCredential = await createUserWithEmailAndPassword(auth, this.email, this.password);

        // Save additional user data to Firestore
        await setDoc(doc(firestore, "users", userCredential.user.uid), {
          email: this.email,
          phoneNumber: this.phoneNumber,
          rego: this.rego,
        });

        this.$router.push("/"); // Redirect to homepage after registration
      } catch (error) {
        this.errorMessage = error.message;
      }
    },
  },
};
</script>

<style scoped>
.register {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
}

.error {
  color: red;
  margin-top: 10px;
}
</style>
