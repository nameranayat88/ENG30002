<template>
  <footer class="footer">
    <div class="footer-content">
      <div class="footer-links">
        <router-link to="/contact">Contact Us</router-link>
        <router-link to="/faq">FAQ</router-link>
        <router-link to="/privacy">Privacy Policy</router-link>
        <router-link to="/terms">Terms of Service</router-link>
      </div>

      <div class="footer-social">
        <a href="https://facebook.com" target="_blank" aria-label="Facebook">
          <i class="fab fa-facebook"></i>
        </a>
        <a href="https://twitter.com" target="_blank" aria-label="Twitter">
          <i class="fab fa-twitter"></i>
        </a>
        <a href="https://linkedin.com" target="_blank" aria-label="LinkedIn">
          <i class="fab fa-linkedin"></i>
        </a>
        <a href="https://instagram.com" target="_blank" aria-label="Instagram">
          <i class="fab fa-instagram"></i>
        </a>
      </div>
    </div>

    <div class="footer-bottom">
      <p>© 2024 Smart Parking. All Rights Reserved.</p>
    </div>
  </footer>
</template>

<script>
export default {
  name: "FooterComponent"
};
</script>

<style scoped>
.footer {
  background-color: #004346; /* Midnight Green */
  color: #e4ecef; /* Light grey text */
  padding: 20px;
  text-align: center;
}

.footer-content {
  display: flex;
  justify-content: center; 
  align-items: center; 
  margin: 10px;
  gap: 30px;
  flex-wrap: wrap;
  padding-bottom: 20px;
  border-bottom: 1px solid #e4ecef;
}

.footer-links {
  display: flex;
  gap: 20px;
}

.footer-links a {
  color: #e4ecef;
  text-align: center;
  text-decoration: none;
}

.footer-links a:hover {
  color: #09bc8a; /* Mint */
  text-decoration: underline;
}

.footer-social {
  display: flex;
  gap: 15px;
}

.footer-social a {
  color: #e4ecef;
  font-size: 20px;
  text-decoration: none;
}

.footer-social a:hover {
  color: #09bc8a; /* Mint */
}

.footer-bottom {
  margin-top: 20px;
}

.footer-bottom p {
  font-size: 14px;
  margin: 0;
}

@media (max-width: 768px) {
  .footer-content {
    flex-direction: column;
  }

  .footer-links {
    margin-bottom: 20px;
  }

  .footer-social {
    margin-top: 10px;
  }
}
</style>
