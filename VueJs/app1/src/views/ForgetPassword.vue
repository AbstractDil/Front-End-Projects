<script setup>
import BaseInput from '@/components/BaseInput.vue';
import { reactive, computed, ref, onMounted} from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required, minLength, maxLength, email } from '@vuelidate/validators';
import { getCurrentInstance } from 'vue';
import axios from 'axios';
import StatusMessage from '@/components/StatusMessage.vue';



const { proxy } = getCurrentInstance(); // Get the current instance's proxy

const formData = reactive({
  email: "",
  //userPassword: "",
});

const formSubmitted = ref(false);
const loading = ref(false);
const actionSuccess = ref(false);
const passwordResetToken = ref(false);
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
  email: { required, email, minLength: minLength(6),maxLength: maxLength(50) },
  //userPassword: { required, minLength: minLength(6), maxLength: maxLength(20)},
}));

const v$ = useVuelidate(rules, formData);

const handleFrgtPwdForm = async () => {
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
  console.log('Validation result:', result);
  console.log('Form data:', formData);

  if (result) {
    loading.value = true;
    try {
      const response = await axios.post('forget-password', formData, {
        headers: { 'Content-Type': 'application/json' },
      });
      if(response.data.status == 200){
      proxy.$swal.fire('Success!', response.data.message, 'success');
      passwordResetToken.value = response.data.data.password_reset_token;
      actionSuccess.value = true;
      }
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
}

const goToNextPage = () => {
  if (passwordResetToken.value) {
    proxy.$router.push(`/change-password/${passwordResetToken.value}`);
  } else {
    console.error('No verification token available.');
  }
};

</script>

<template>
  <div class="bg-body-tertiary min-vh-100 d-flex align-items-center justify-content-center">
    <div v-if="!actionSuccess" class="card p-3" style="width:22em;">
      <div class="card-body text-start">
        <h5 class="card-title text-center mb-4 fw-bold text-success">Forget Password <i class="bi bi-patch-question-fill"></i></h5>
        <form @submit.prevent="handleFrgtPwdForm">
          
          <BaseInput label="Email" v-model="formData.email" type="email" />

            <p v-if="formSubmitted && v$.email.required.$invalid">
              <small class="text-danger">
                Email is required
              </small>
            </p>
            <p v-if="formSubmitted && !v$.email.required.$invalid && v$.email.email.$invalid">
              <small class="text-danger">
                Please enter a valid email address
              </small>
            </p>

            <p v-if="formSubmitted && !v$.email.required.$invalid && !v$.email.email.$invalid && v$.email.minLength.$invalid">
            <small class="text-danger">
              Email must be at least 6 characters long.
            </small>
            </p>

            <p v-if="formSubmitted && !v$.email.required.$invalid && !v$.email.email.$invalid && v$.email.maxLength.$invalid">
            <small class="text-danger">
              Email cannot exceed 50 characters.
            </small>
            </p>

             <!-- CAPTCHA Section -->
             <div class="form-group mt-3 mb-2">
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
          
          
          <div class="d-grid gap-2 col-12 mx-auto">
            <button class="btn btn-success" type="submit" :disabled="loading">
                <template v-if="loading">
                  <div class="spinner-border text-light spinner-border-sm" role="status">
                    <span class="visually-hidden">Loading...</span>
                  </div>
                </template>
                <template v-else>
                  <i class="bi bi-check-lg"></i> Verify email
                </template>
              </button>
          </div>
          
        </form>
        <p class="mt-3 mx-3">
          <ul class="list-group list-group-flush ">
            <li class=" text-muted font-sm" >
              Don't have an account ?  <router-link class="text-success" to="/register"> Register Now </router-link>
            </li>
            <li class=" text-muted font-sm">
             Already have an account ?  <router-link class="text-success" to="/">Login Now</router-link>
            </li>

          </ul>
        </p>
      </div>
    </div>
   <!-- Success Message Card Starts -->
   <StatusMessage
      :visible="actionSuccess"
      title="Email Sent"
      message="Password change request has been created successfully. Please check your email and click on the link below to change your password. Link is active for the next 10 minutes."
      icon="bi bi-envelope-check-fill"
      buttonText="Click here to change your password"
      @button-click="goToNextPage"
    />
    <!-- Success Message Card Ends -->
  </div>
</template>

