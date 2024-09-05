<script setup>
import BaseInput from '@/components/BaseInput.vue';
import { reactive, computed, ref } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required, minLength, maxLength, email } from '@vuelidate/validators';
import axios from 'axios';
import { getCurrentInstance } from 'vue';


const { proxy } = getCurrentInstance(); // Get the current instance's proxy

const formData = reactive({
  email: "",
  password: "",
});

const formSubmitted = ref(false);
const loading = ref(false); // Loader state

const rules = computed(() => ({
  email: { required, email, minLength: minLength(6), maxLength: maxLength(50) },
  password: { required, minLength: minLength(6), maxLength: maxLength(20) },
}));

const v$ = useVuelidate(rules, formData);

const handleLogin = async () => {
  formSubmitted.value = true;
  const result = await v$.value.$validate();
  console.log('Validation result:', result);
  console.log('Form data:', formData);

  if (result) {
    loading.value = true; // Show the loader
    try {
      // Send a POST request to the backend's login route
      const response = await axios.post('/login', formData);

     // Handle success response
     console.log('Response from backend:', response.data);
     const token = response.data.token; // Get the token from the response
      localStorage.setItem('token', token); // Store the token in local storage
      proxy.$swal.fire('Success!', 'Login was successful!', 'success');
      console.log('Token stored in local storage:', token);

      // Optionally, redirect the user after successful login
      proxy.$router.push('/profile');
    } catch (error) {
     // Handle error response
     console.error('Error during login:', error.response.data);
      const statusCode = error.response.status;
      const errorMessages = Object.values(error.response.data.messages || {}).join(' ');
      
      proxy.$swal.fire(`Error ${statusCode}!`, errorMessages || 'Login failed. Please try again.', 'error');
    } finally {
      loading.value = false; // Hide the loader after the request is fulfilled
    }
  } else {
    proxy.$swal.fire('Warning!', 'Form validation errors! Please review the fields carefully.', 'warning');
  }
}
</script>
<template>
  <div class="bg-body-tertiary min-vh-100 d-flex align-items-center justify-content-center">
    <div class="card p-3" style="width:24em;">
      <div class="card-body text-start">
        <h5 class="card-title text-center mb-4 fw-bold text-success"> <i class="bi bi-lock-fill"></i> Member Login</h5>
        <form @submit.prevent="handleLogin">
          
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

          <BaseInput label="Password" v-model="formData.password" type="password" />
          <p v-if="formSubmitted && v$.password.required.$invalid">
            <small class="text-danger">
              Password is required
            </small>
          </p>
          <p v-if="formSubmitted && !v$.password.required.$invalid && v$.password.minLength.$invalid">
            <small class="text-danger">
              Password must be at least 6 characters long
            </small>
          </p>
          <p v-if="formSubmitted && !v$.password.required.$invalid && v$.password.maxLength.$invalid">
            <small class="text-danger">
              Password cannot exceed 20 characters
            </small>
          </p>
          
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
          <ul class="list-group list-group-flush ">
            <li class=" text-muted font-sm" >
              Don't have account ?  <router-link class="text-success" to="/register"> Register Now </router-link>
            </li>
            <li class=" text-muted font-sm">
             Forgot your password ?  <router-link class="text-success" to="/forget-password"> Change password</router-link>
            </li>

          </ul>
        </p>
      </div>
    </div>
  </div>
</template>
