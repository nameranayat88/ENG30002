<template>
  <div class="payment-form">
    <h3 v-if="!paymentSuccess">Complete your Payment</h3>

    <!-- Payment Form -->
    <form v-if="!paymentSuccess" @submit.prevent="processPayment">
      <div>
        <input
          type="text"
          placeholder="Card Number"
          v-model="payment.cardNumber"
          @input="validateCardNumber"
          required
          maxlength="16"
        />
        <span v-if="errors.cardNumber" class="error-message">{{ errors.cardNumber }}</span>
      </div>

      <div>
        <input
          type="text"
          placeholder="Expiration Date (MM/YY)"
          v-model="payment.expirationDate"
          @input="validateExpiryDate"
          required
          maxlength="5"
        />
        <span v-if="errors.expirationDate" class="error-message">{{ errors.expirationDate }}</span>
      </div>

      <div>
        <input
          type="text"
          placeholder="CVV"
          v-model="payment.cvv"
          @input="validateCVV"
          required
          maxlength="3"
        />
        <span v-if="errors.cvv" class="error-message">{{ errors.cvv }}</span>
      </div>

      <button type="submit" class="btn btn-success" :disabled="isProcessing || hasErrors">
        {{ isProcessing ? 'Processing...' : 'Submit Payment' }}
      </button>
    </form>

    <!-- Payment Success Message -->
    <div v-if="paymentSuccess" class="success-message">
      <h4>Payment Successful!</h4>
      <p>Your payment of ${{ totalCost }} has been successfully processed.</p>
      <button class="btn btn-primary" @click="goToHome">Go to Home</button>
    </div>

    <!-- Payment Failed Message -->
    <div v-if="paymentFailed" class="error-message">
      <h4>Payment Failed</h4>
      <p>There was an error processing your payment. Please try again.</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    totalPrice: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      payment: {
        cardNumber: "",
        expirationDate: "",
        cvv: "",
      },
      paymentSuccess: false,
      paymentFailed: false,
      isProcessing: false,
      totalCost: this.totalPrice || 0, // Get total cost from prop
      errors: {
        cardNumber: null,
        expirationDate: null,
        cvv: null,
      },
    };
  },
  computed: {
    hasErrors() {
      return !!this.errors.cardNumber || !!this.errors.expirationDate || !!this.errors.cvv;
    },
  },
  methods: {
    validateCardNumber() {
      const cardNumberRegex = /^[0-9]{16}$/;
      if (!cardNumberRegex.test(this.payment.cardNumber)) {
        this.errors.cardNumber = "Card number must be exactly 16 digits.";
      } else {
        this.errors.cardNumber = null;
      }
    },
    validateExpiryDate() {
      const expiryDateRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
      const [month, year] = this.payment.expirationDate.split("/");

      if (!expiryDateRegex.test(this.payment.expirationDate)) {
        this.errors.expirationDate = "Expiration date must be in MM/YY format.";
        return;
      }

      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1;
      const currentYear = currentDate.getFullYear() % 100;

      if (parseInt(year, 10) < currentYear || (parseInt(year, 10) === currentYear && parseInt(month, 10) < currentMonth)) {
        this.errors.expirationDate = "Expiration date cannot be in the past.";
      } else {
        this.errors.expirationDate = null;
      }
    },
    validateCVV() {
      const cvvRegex = /^[0-9]{3}$/;
      if (!cvvRegex.test(this.payment.cvv)) {
        this.errors.cvv = "CVV must be exactly 3 digits.";
      } else {
        this.errors.cvv = null;
      }
    },
    processPayment() {
      if (!this.hasErrors) {
        this.isProcessing = true;

        setTimeout(() => {
          const isPaymentSuccessful = Math.random() > 0.3;

          this.isProcessing = false;
          if (isPaymentSuccessful) {
            this.paymentSuccess = true;
            this.paymentFailed = false;
          } else {
            this.paymentFailed = true;
            this.paymentSuccess = false;
          }
        }, 2000);
      }
    },
    goToHome() {
      this.$router.push("/"); // Redirect to home
    },
  },
};
</script>

<style scoped>
.payment-form {
  max-width: 400px;
  margin: 0 auto;
  text-align: center;
}

button {
  margin-top: 20px;
}

.success-message,
.error-message {
  margin-top: 20px;
}

.success-message h4 {
  color: green;
}

.error-message h4 {
  color: red;
}

.error-message {
  color: red;
  font-size: 14px;
  margin-top: 5px;
}
</style>
