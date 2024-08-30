<template>
  <div class="bg-body-tertiary min-vh-100 d-flex align-items-center justify-content-center">
    <!-- Card Starts -->
    <div class="card p-3" style="width:24em;">
      <div class="card-body text-start">
        <h5 class="card-title text-center mb-4 fw-bold text-success">
          <i class="bi bi-person-add"></i> Registration
        </h5>
        <form @submit.prevent="handleRegistration">
          <BaseInput label="Fullname" v-model="formData.name" />

          <p v-if="formSubmitted && v$.name.required.$invalid">
            <small class="text-danger">
              Fullname is required
            </small>
          </p>
          <p v-if="formSubmitted && !v$.name.required.$invalid && v$.name.minLength.$invalid">
            <small class="text-danger">
              Minimum length is 3 characters
            </small>
          </p>

          <p v-if="formSubmitted && !v$.name.required.$invalid && v$.name.maxLength.$invalid">
            <small class="text-danger">
              Maximum length is 20 characters
            </small>
          </p>

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

          <BaseInput label="Confirm Password" v-model="formData.confirm_password" type="password" />
          <p v-if="formSubmitted && v$.confirm_password.required.$invalid">
            <small class="text-danger">
              Confirm password is required
            </small>
          </p>
          <p v-if="formSubmitted && !v$.confirm_password.required.$invalid && v$.confirm_password.sameAs.$invalid">
            <small class="text-danger">
              Passwords do not match
            </small>
          </p>

          <div class="d-grid gap-2 col-12 mx-auto">
            <button class="btn btn-success" type="submit">
              <i class="bi bi-check-lg"></i> Register
            </button>
          </div>
        </form>

        <p class="mt-3 mx-3">
          <ul class="list-group list-group-flush">
            <li class="text-muted font-sm">
              Already have an account? <router-link class="text-success" to="/">Login Now</router-link>
            </li>
          </ul>
        </p>
      </div>
    </div>
    <!-- Card Ends -->
  </div>
</template>

<script setup>
import BaseInput from '@/components/BaseInput.vue';
import { reactive, computed, ref } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required, minLength, maxLength, email, sameAs } from '@vuelidate/validators';
import { getCurrentInstance } from 'vue';
import axios from 'axios'; // Import Axios

const { proxy } = getCurrentInstance(); // Get the current instance's proxy

const formData = reactive({
  name: '',
  email: '',
  password: '',
  confirm_password: '',
});

const formSubmitted = ref(false);

const rules = computed(() => ({
  name: { required, minLength: minLength(3), maxLength: maxLength(30) },
  email: { required, email, minLength: minLength(6),maxLength: maxLength(50) },
  password: { required, minLength: minLength(6), maxLength: maxLength(20)},
  confirm_password: { required, sameAs: sameAs(formData.password) },
}));

const v$ = useVuelidate(rules, formData);

const handleRegistration = async () => {
  formSubmitted.value = true;
  const result = await v$.value.$validate();
  console.log('Validation result:', result);
  console.log('Form data being sent:', JSON.stringify(formData));


  if (result) {
    try {
      // Send a POST request to the backend
      const response = await axios.post('create-user', formData, {
            headers: {
        'Content-Type': 'application/json',
      },
      });

      // Handle success response
      proxy.$swal.fire('Success!', 'Registration was successful!', 'success');
      console.log('Response from backend:', response.data);
    } catch (error) {
      // Handle error response
      console.error('Error during registration:', error.response.data);
      proxy.$swal.fire('Error!', 'There was an error during registration. Please try again later.', 'error');
    }
  } else {
    proxy.$swal.fire('Warning!', 'Form validation errors! Please review the fields carefully.', 'warning');
  }
};
</script>
