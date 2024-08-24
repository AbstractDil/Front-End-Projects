<script setup>
import BaseInput from '@/components/BaseInput.vue';
import { reactive, computed, ref } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required, minLength, maxLength, email } from '@vuelidate/validators';
import { getCurrentInstance } from 'vue';

const { proxy } = getCurrentInstance(); // Get the current instance's proxy

const formData = reactive({
  userEmail: "",
  userPassword: "",
});

const formSubmitted = ref(false);

const rules = computed(() => ({
  userEmail: { required, email, minLength: minLength(6),maxLength: maxLength(50) },
  userPassword: { required, minLength: minLength(6), maxLength: maxLength(20)},
}));

const v$ = useVuelidate(rules, formData);

const handleLogin = async () => {
  formSubmitted.value = true;
  const result = await v$.value.$validate();
  console.log('Validation result:', result);
  console.log('Form data:', formData);

  if (result) {
    proxy.$swal.fire('Success!', 'Login was successful!', 'success'); // Use proxy.$swal
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
          
          <BaseInput label="Email" v-model="formData.userEmail" type="email" />

          <p v-if="formSubmitted && v$.userEmail.required.$invalid">
            <small class="text-danger">
              Email is required
            </small>
          </p>
          <p v-if="formSubmitted && !v$.userEmail.required.$invalid && v$.userEmail.email.$invalid">
            <small class="text-danger">
              Please enter a valid email address
            </small>
          </p>

          <p v-if="formSubmitted && !v$.userEmail.required.$invalid && !v$.userEmail.email.$invalid && v$.userEmail.minLength.$invalid">
          <small class="text-danger">
            Email must be at least 6 characters long.
          </small>
        </p>

        <p v-if="formSubmitted && !v$.userEmail.required.$invalid && !v$.userEmail.email.$invalid && v$.userEmail.maxLength.$invalid">
          <small class="text-danger">
            Email cannot exceed 50 characters.
          </small>
        </p>

          <BaseInput label="Password" v-model="formData.userPassword" type="password" />
          <p v-if="formSubmitted && v$.userPassword.required.$invalid">
            <small class="text-danger">
              Password is required
            </small>
          </p>
          <p v-if="formSubmitted && !v$.userPassword.required.$invalid && v$.userPassword.minLength.$invalid">
            <small class="text-danger">
              Password must be at least 6 characters long
            </small>
          </p>
          <p v-if="formSubmitted && !v$.userPassword.required.$invalid && v$.userPassword.maxLength.$invalid">
            <small class="text-danger">
              Password cannot exceed 20 characters
            </small>
          </p>
          
          <div class="d-grid gap-2 col-12 mx-auto">
            <button class="btn btn-success" type="submit"> <i class="bi bi-check-lg"></i> Login</button>
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
