<template>
  <v-container fluid class="login-container">
    <div class="login-card-wrapper">
      <!-- Logo and animated background -->
      <div class="logo-container">
        <!-- Uncomment and replace with your logo path if needed -->
        <!-- <img src="/src/assets/lg.webp" alt="Company Logo" class="company-logo animate-fade-in"> -->
        <div class="animated-circles">
          <div class="circle"></div>
          <div class="circle"></div>
          <div class="circle"></div>
        </div>
      </div>

      <v-card class="login-card" elevation="12">
        <v-card-text>
          <div class="text-center mb-8">
            <h2 class="text-h4 font-weight-bold title-gradient">
              Global Quality Trading CO.
            </h2>
            <p class="text-subtitle-1 subtitle-text">
              Welcome back! Please sign in to continue
            </p>
          </div>

          <v-form ref="form" @submit.prevent="login" class="login-form">
            <v-text-field
              v-model="username"
              label="Username"
              :rules="[(v) => !!v || 'Username is required']"
              prepend-inner-icon="mdi-account"
              variant="outlined"
              class="input-field animate-slide-up"
              dense
            ></v-text-field>

            <v-text-field
              v-model="password"
              label="Password"
              :rules="[(v) => !!v || 'Password is required']"
              prepend-inner-icon="mdi-lock"
              :append-inner-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
              :type="show1 ? 'text' : 'password'"
              @click:append-inner="show1 = !show1"
              variant="outlined"
              class="input-field animate-slide-up"
              dense
            ></v-text-field>

            <div class="d-flex align-center justify-space-between mb-6 options-container">
              <v-checkbox
                v-model="rememberMe"
                label="Remember me"
                class="animate-fade-in"
                hide-details
                color="primary"
              ></v-checkbox>
              <a href="#" class="forgot-link animate-fade-in">Forgot Password?</a>
            </div>

            <v-btn
              color="primary"
              block
              height="48"
              :loading="loading"
              type="submit"
              class="login-btn animate-slide-up"
            >
              Sign In
            </v-btn>

            <v-alert
              v-if="error"
              type="error"
              class="mt-4 animate-shake"
              dense
              outlined
            >
              {{ error }}
            </v-alert>
          </v-form>
        </v-card-text>
      </v-card>
    </div>
  </v-container>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'Login',
  data() {
    return {
      username: '',
      password: '',
      error: null,
      show1: false,
      loading: false,
      rememberMe: false
    }
  },
  methods: {
    ...mapActions('user', ['USER_LOGIN']),
    async login() {
      if (!this.$refs.form.validate()) return

      this.loading = true
      this.error = null

      try {
        const payload = {
          username: this.username,
          password: this.password
        }
        await this.USER_LOGIN(payload)
        this.$router.push({ name: 'dash' })
      } catch (err) {
        this.error = err.response?.data?.message || 'Login failed'
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
/* Container Styling */
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(145deg, #0d47a1 0%, #1976d2 100%);
  overflow: hidden;
}

/* Card Wrapper */
.login-card-wrapper {
  width: 100%;
  max-width: 480px;
  padding: 24px;
}

/* Logo Container */
.logo-container {
  text-align: center;
  margin-bottom: 2.5rem;
  position: relative;
}

.company-logo {
  width: 140px;
  height: auto;
  margin-bottom: 1.5rem;
}

/* Login Card */
.login-card {
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.95) !important;
  backdrop-filter: blur(12px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  overflow: hidden;
}

.login-form {
  padding: 0 1.5rem;
}

/* Title Styling */
.title-gradient {
  background: linear-gradient(90deg, #1976d2, #42a5f5);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: 0.5px;
}

.subtitle-text {
  color: #666;
  font-weight: 500;
}

/* Input Fields */
.input-field {
  margin-bottom: 1.5rem;
  border-radius: 8px;
}

.input-field .v-input__control {
  background: rgba(245, 245, 245, 0.8);
  border-radius: 8px;
}

/* Options Container */
.options-container {
  margin-bottom: 2rem;
}

.forgot-link {
  color: #1976d2;
  font-size: 0.9rem;
  font-weight: 500;
  text-decoration: none;
  transition: color 0.3s ease;
}

.forgot-link:hover {
  color: #42a5f5;
  text-decoration: underline;
}

/* Button Styling */
.login-btn {
  border-radius: 10px;
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 1px;
  box-shadow: 0 4px 15px rgba(25, 118, 210, 0.4);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(25, 118, 210, 0.6);
}

/* Animated Circles */
.animated-circles {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: -1;
  overflow: hidden;
}

.circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
  animation: float 6s infinite ease-in-out;
}

.circle:nth-child(1) {
  width: 120px;
  height: 120px;
  left: -60px;
  top: 70%;
  animation-delay: 0s;
}

.circle:nth-child(2) {
  width: 180px;
  height: 180px;
  right: -90px;
  top: 30%;
  animation-delay: 1.5s;
}

.circle:nth-child(3) {
  width: 90px;
  height: 90px;
  left: 60%;
  top: -10%;
  animation-delay: 3s;
}

/* Animations */
.animate-fade-in {
  animation: fadeIn 0.8s ease-in-out;
}

.animate-slide-up {
  animation: slideUp 0.8s ease-in-out;
}

.animate-shake {
  animation: shake 0.6s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    transform: translateY(30px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-12px); }
  40% { transform: translateX(12px); }
  60% { transform: translateX(-6px); }
  80% { transform: translateX(6px); }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) scale(1);
  }
  50% {
    transform: translateY(-25px) scale(1.05);
  }
}

/* Responsive Design */
@media (max-width: 600px) {
  .login-card-wrapper {
    padding: 16px;
    max-width: 100%;
  }

  .login-form {
    padding: 0 1rem;
  }

  .title-gradient {
    font-size: 1.5rem;
  }

  .login-btn {
    height: 44px;
  }

  .circle {
    transform: scale(0.8);
  }
}
</style>