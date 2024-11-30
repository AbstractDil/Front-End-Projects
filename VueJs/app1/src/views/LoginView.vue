<template>
  <div class="bg-body-tertiary  d-flex align-items-center">
    <div class="container my-5">
      <div class="row align-items-center">
        <!-- Carousel Section -->
        <div class="col-lg-7 mb-4 mb-lg-0">
          <CarouselBanner />
        </div>
        <!-- Login Card Section -->
        <div class="col-lg-5">
          <div class="card p-3 my-4" style="max-width: 22em; margin: auto;">
            <div class="card-body text-start">
              <h5 class="card-title text-center mb-4 fw-bold text-success">
                <i class="bi bi-lock-fill"></i> Member Login
              </h5>
              <form @submit.prevent="handleLogin">
                <BaseInput label="Email" v-model="formData.email" type="email" />
                <p v-if="formSubmitted && v$.formData.email.required.$invalid">
                  <small class="text-danger">Email is required</small>
                </p>
                <!-- Other validation messages... -->
                <BaseInput label="Password" v-model="formData.password"
                  v-bind:type="passwordVisible ? 'text' : 'password'" />
                <i class="toggle-password bi" :class="passwordVisible ? 'bi-eye-fill' : 'bi-eye-slash-fill'"
                  @click="togglePassword()"></i>
                <p v-if="formSubmitted && v$.formData.password.required.$invalid">
                  <small class="text-danger">Password is required</small>
                </p>
                <!-- Other validation messages... -->

                <!-- CAPTCHA Section -->
                <div class="form-group mb-3">
                  <!-- <label for="captcha">Captcha</label> -->
                  <div class="d-flex align-items-center">
                    <div class="bg-light px-3 py-2 rounded text-success fw-bold me-2">{{ captcha }}</div>
                    <button type="button" class="btn btn-sm btn-link text-muted" @click="generateCaptcha()"> <i class="bi bi-arrow-clockwise"></i> Regenerate</button>
                  </div>
                  <input type="text" id="captcha" v-model="captchaInput" class="form-control mt-2"
                    placeholder="Enter CAPTCHA" />
                  <p v-if="captchaError">
                    <small class="text-danger">CAPTCHA does not match. Please try again.</small>
                  </p>
                </div>

                <div class="d-grid gap-2 col-12 mx-auto">
                  <button class="btn btn-success" type="submit" :disabled="loading">
                    <template v-if="loading">
                      <div class="spinner-border text-light spinner-border-sm" role="status">
                        <span class="visually-hidden">Loading...</span>
                      </div>
                    </template>
                    <template v-else>
                      <i class="bi bi-check-lg"></i> Login
                    </template>
                  </button>
                </div>
              </form>
              <p class="mt-3 mx-3">
              <ul class="list-group list-group-flush">
                <li class="text-muted font-sm">
                  Don't have an account? <router-link class="text-success" to="/register"> Register Now </router-link>
                </li>
                <li class="text-muted font-sm">
                  Forgot your password? <router-link class="text-success" to="/forget-password"> Change
                    password</router-link>
                </li>
              </ul>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import BaseInput from '@/components/BaseInput.vue';
import CarouselBanner from '@/components/CarouselBanner.vue';
import { required, minLength, maxLength, email } from '@vuelidate/validators';
import axios from '@/axios'; // Import your axios instance with baseURL
import Swal from 'sweetalert2';
import { mapActions } from 'vuex';
//import { useRouter } from 'vue-router';
import useVuelidate from '@vuelidate/core';

export default {
  components: {
    BaseInput,
    CarouselBanner
  },

  setup() {
    return { v$: useVuelidate() };
  },

  data() {
    return {
      formData: {
        email: '',
        password: '',
      },
      formSubmitted: false,
      loading: false, // Loader state
      passwordVisible: false,
      captcha: '', // Generated CAPTCHA
      captchaInput: '', // User input for CAPTCHA
      captchaError: false, // Flag for CAPTCHA error
    };
  },

  validations() {
    return {
      formData: {
        email: { required, email, minLength: minLength(6), maxLength: maxLength(50) },
        password: { required, minLength: minLength(6), maxLength: maxLength(20) },
      },
    };
  },


  methods: {

    generateCaptcha() {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      this.captcha = Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    },

    togglePassword() {
      this.passwordVisible = !this.passwordVisible;
    },

    ...mapActions('auth', ['setUserData', 'setToken', 'setUserDetails']),

    async handleLogin() {
      this.formSubmitted = true;


      // Validate the CAPTCHA
      if (this.captchaInput !== this.captcha) {
        this.captchaError = true;
        Swal.fire('Error!', 'CAPTCHA is incorrect. Please try again.', 'error');
        this.generateCaptcha(); // Regenerate CAPTCHA on error
        return;
      } else {
        this.captchaError = false;
      }

      const isFormCorrect = await this.v$.$validate();

      if (!isFormCorrect) {
        Swal.fire('Warning!', 'Please correct the form errors and try again.', 'warning');
        return;
      }

      this.loading = true;
      try {
        const response = await axios.post('/login', this.formData);

        if (response?.data?.data?.token && response?.data?.data?.uid) {
          const { token, uid, name, email, created_at, updated_at, is_email_verified, email_verified_at, profile_photo_path, form_id, user_type } = response.data.data;

          // Store token and user details in Vuex store
          this.setToken(token);
          this.setUserData(uid);  // Store UID separately
          this.setUserDetails({ uid, name, email, created_at, updated_at, is_email_verified, email_verified_at, profile_photo_path, form_id, user_type });

          Swal.fire('Success!', 'Login successful!', 'success');
          this.$router.push('/dashboard');
        } else {
          Swal.fire('Error!', 'Login failed. Please try again.', 'error');
        }
      } catch (error) {
        if (!error.response) {
          Swal.fire('Connection Error!', 'Backend server is not responding. Please try again later.', 'error');
        } else {
          const statusCode = error.response?.status || 'Unknown';
          const errorMessages = Object.values(error.response?.data?.messages || {}).join(' ') || 'Login failed. Please try again.';
          Swal.fire(`Error ${statusCode}!`, errorMessages, 'error');
        }
      } finally {
        this.loading = false;
      }
    },



  },

  mounted() {
    this.generateCaptcha();
  },



};
</script>