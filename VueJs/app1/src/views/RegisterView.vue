<template>
<div class="bg-body-tertiary ">
  <div class="d-flex align-items-center" v-if="!registrationSuccess" >
    <div class="container my-5">
    <div class="row align-items-center">
      <!-- Carousel Section -->
      <div class="col-lg-7 mb-4 mb-lg-0">
        <CarouselBanner/>

      </div>
    <!-- Registration Form Card Starts -->
    <div class="col-lg-5"> 
      <div class="card p-3 my-4" style="max-width: 22em; margin: auto;">
        <div class="card-body text-start">
          <h5 class="card-title text-center mb-4 fw-bold text-success">
            <i class="bi bi-person-add"></i> Registration
          </h5>
          <form @submit.prevent="handleNextStep">
            <!-- Step 1: Name and Email -->
            <div v-if="currentStep === 1">
              <BaseInput label="Fullname" v-model="formData.name" />
              <p v-if="formSubmitted && v$.name.required.$invalid">
                <small class="text-danger">Fullname is required</small>
              </p>
              <p v-if="formSubmitted && !v$.name.required.$invalid && v$.name.minLength.$invalid">
                <small class="text-danger">Minimum length is 3 characters</small>
              </p>
              <p v-if="formSubmitted && !v$.name.required.$invalid && v$.name.maxLength.$invalid">
                <small class="text-danger">Maximum length is 20 characters</small>
              </p>

              <BaseInput label="Email" v-model="formData.email" type="email" />
              <p v-if="formSubmitted && v$.email.required.$invalid">
                <small class="text-danger">Email is required</small>
              </p>
              <p v-if="formSubmitted && !v$.email.required.$invalid && v$.email.email.$invalid">
                <small class="text-danger">Please enter a valid email address</small>
              </p>
              <p v-if="formSubmitted && !v$.email.required.$invalid && v$.email.minLength.$invalid">
                <small class="text-danger">Email must be at least 8 characters long.</small>
              </p>
              <p v-if="formSubmitted && !v$.email.required.$invalid && v$.email.maxLength.$invalid">
                <small class="text-danger">Email cannot exceed 50 characters.</small>
              </p>
            </div>

            <!-- Step 2: Password and Confirm Password -->
            <div v-if="currentStep === 2">
              <BaseInput label="Password" v-model="formData.password" v-bind:type="passwordVisible? 'text' : 'password'"/>
              <i class="toggle-password bi" :class="passwordVisible ? 'bi-eye-fill' : 'bi-eye-slash-fill'" @click="togglePassword()"></i>

              <p v-if="formSubmitted && v$.password.required.$invalid">
                <small class="text-danger">Password is required</small>
              </p>
              <p v-if="formSubmitted && !v$.password.required.$invalid && v$.password.minLength.$invalid">
                <small class="text-danger">Password must be at least 6 characters long</small>
              </p>
              <p v-if="formSubmitted && !v$.password.required.$invalid && v$.password.maxLength.$invalid">
                <small class="text-danger">Password cannot exceed 20 characters</small>
              </p>

              <BaseInput label="Confirm Password" v-model="formData.confirm_password" v-bind:type="passwordVisible? 'text' : 'password'" />
              <i class="toggle-password bi" :class="passwordVisible ? 'bi-eye-fill' : 'bi-eye-slash-fill'" @click="togglePassword()"></i>
              <p v-if="formSubmitted && v$.confirm_password.required.$invalid">
                <small class="text-danger">Confirm password is required</small>
              </p>
              <p v-if="formSubmitted && !v$.confirm_password.required.$invalid && v$.confirm_password.sameAs.$invalid">
                <small class="text-danger">Passwords do not match</small>
              </p>
              <!-- CAPTCHA Section -->
              <div class="form-group mt-3">
                <!-- <label for="captcha">Captcha</label> -->
                <div class="d-flex align-items-center">
                  <div class="bg-light py-2 px-3 rounded text-success fw-bold me-2">{{ captcha }}</div>
                  <button type="button" class="btn btn-sm btn-link text-muted" @click="generateCaptcha"> <i class="bi bi-arrow-clockwise"></i> Regenerate</button>
                </div>
                <input
                  type="text"
                  id="captcha"
                  v-model="captchaInput"
                  class="form-control mt-2"
                  placeholder="Enter CAPTCHA"
                />
                <p v-if="captchaError">
                  <small class="text-danger">CAPTCHA is incorrect. Please try again.</small>
                </p>
              </div>
            </div>



            <!-- Navigation Buttons -->
            <div class="d-grid gap-2 col-12 mx-auto mt-3">
              <button v-if="currentStep > 1" class="btn btn-light" type="button" @click="handleBack"><i class="bi bi-chevron-double-left"></i> Back</button>
              <button class="btn btn-success" type="submit" :disabled="loading">
                <template v-if="loading">
                  <div class="spinner-border text-light spinner-border-sm" role="status">
                    <span class="visually-hidden">Loading...</span>
                  </div>
                </template>
                <template v-else>
                  <i class="bi bi-check-lg"></i>
                  {{ currentStep === 2 ? 'Register' : 'Next' }}
                </template>
              </button>
            </div>
          </form>

          <p class="mt-3 mx-3">
            <ul class="list-group list-group-flush">
              <li class="text-muted font-sm">
                Already have an account? <router-link class="text-success" to="/">Login Now</router-link>
              </li>
              <li class="text-muted font-sm">
                Already have an account? Forgot to verify your email?  <router-link class="text-success" to="/email-verification">Click here</router-link>
              </li>
            </ul>
          </p>
        </div>
      </div>
    </div>
    <!-- Registration Form Card Ends -->
     </div>
     </div>
    </div>

    <!-- Success Message Card Starts -->
    <StatusMessage
      :visible="registrationSuccess"
      title="Verification Email Sent"
      message="Please verify your account by clicking on the link in the email we sent you."
      icon="bi bi-envelope-check-fill"
      buttonText="Verify Email"
      @button-click="goToVerificationPage"
    />
    <!-- Success Message Card Ends -->
  </div>
</template>

<script setup>
import BaseInput from '@/components/BaseInput.vue';
import CarouselBanner from '@/components/CarouselBanner.vue';
import StatusMessage from '@/components/StatusMessage.vue';
import { reactive, computed, ref, onMounted } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required, minLength, maxLength, email, sameAs } from '@vuelidate/validators';
import { getCurrentInstance } from 'vue';
import axios from 'axios';

const { proxy } = getCurrentInstance();

const formData = reactive({
  name: '',
  email: '',
  password: '',
  confirm_password: '',
});

const formSubmitted = ref(false);
const loading = ref(false);
const passwordVisible = ref(false);
const registrationSuccess = ref(false);
const verificationToken = ref('');
const currentStep = ref(1); // Track the current step
const captcha = ref(''); // Stores the generated CAPTCHA
const captchaInput = ref(''); // Stores the user's input for the CAPTCHA
const captchaError = ref(false); // Tracks if the CAPTCHA validation fails

// Method to generate a new CAPTCHA
const generateCaptcha = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  captcha.value = Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
};




// Generate CAPTCHA when the component is mounted
onMounted(() => {
  generateCaptcha();
});


const rules = computed(() => ({
  name: { required, minLength: minLength(3), maxLength: maxLength(30) },
  email: { required, email, minLength: minLength(8), maxLength: maxLength(50) },
  password: { required, minLength: minLength(6), maxLength: maxLength(20) },
  confirm_password: { required, sameAs: sameAs(formData.password) },
}));

const v$ = useVuelidate(rules, formData);

const togglePassword = () =>{
  passwordVisible.value = !passwordVisible.value;
}

const handleNextStep = async () => {
  formSubmitted.value = true;

  if (currentStep.value === 1) {
    const step1Valid = await v$.value.name.$validate() && await v$.value.email.$validate();
    if (step1Valid) {
      currentStep.value = 2;
      formSubmitted.value = false;
    } else {
      proxy.$swal.fire('Warning!', 'Please complete all required fields in Step 1.', 'warning');
    }
  } else if (currentStep.value === 2) {
    await handleRegistration();
  }
};

const handleBack = () => {
  if (currentStep.value > 1) currentStep.value--;
};

const handleRegistration = async () => {
  formSubmitted.value = true;

  // Validate CAPTCHA
  if (captchaInput.value !== captcha.value) {
    captchaError.value = true;
    proxy.$swal.fire('Error!', 'CAPTCHA is incorrect. Please try again.', 'error');
    generateCaptcha(); // Regenerate CAPTCHA if validation fails
    return;
  } else {
    captchaError.value = false; // Reset CAPTCHA error if it matches
  }

  const result = await v$.value.$validate();

  if (result) {
    loading.value = true;
    try {
      const response = await axios.post('create-user', formData, {
        headers: { 'Content-Type': 'application/json' },
      });

      proxy.$swal.fire('Success!', 'Verification email sent. Please check your inbox or spam folder.', 'success');
      verificationToken.value = response.data.verification_token;
      registrationSuccess.value = true;
    } catch (error) {
       // Check if the error response is available
       if (error.response) {
        // If error.response exists, show the error based on status code
        const statusCode = error.response.status;
        const errorMessages = Object.values(error.response.data.messages).join(' ') || 'An unexpected error occurred.';
        proxy.$swal.fire(`Error ${statusCode}!`, errorMessages, 'error');
      } else {
        // If error.response does not exist, it means the backend is not responding
        proxy.$swal.fire('Connection Error!', 'Backend server is not responding. Please try again later.', 'error');
      }
    } finally {
      loading.value = false;
    }
  } else {
    proxy.$swal.fire('Warning!', 'Form validation errors! Please review the fields carefully.', 'warning');
  }
};

const goToVerificationPage = () => {
  if (verificationToken.value) {
    proxy.$router.push(`/verify-email/${verificationToken.value}`);
  } else {
    console.error('No verification token available.');
  }
};



</script>

<style>
/* Add any custom styles here if needed */
</style>
