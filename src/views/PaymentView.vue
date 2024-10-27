<template>
  <div class="payment-view">
    <h1>Payment</h1>
    <!-- Pass the totalPrice from the charging session -->
    <PaymentForm :totalPrice="totalPrice" />
  </div>
</template>

<script>
import PaymentForm from "@/components/PaymentForm.vue";

export default {
  name: "PaymentView",
  components: {
    PaymentForm,
  },
  data() {
    return {
      totalPrice: this.$route.query.totalCost || 0, // Get total price from query parameter
    };
  },
};
</script>

<style scoped>
.payment-view {
  text-align: center;
  padding: 20px;
}
</style>
