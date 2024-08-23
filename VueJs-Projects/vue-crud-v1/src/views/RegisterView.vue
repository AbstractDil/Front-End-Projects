<template>
  <div class="bg-body-tertiary min-vh-100 d-flex align-items-center justify-content-center">
    <!-- Card Starts -->
    <div class="card p-3" style="width:24em;">
      <div class="card-body text-start">
        <h5 class="card-title text-center mb-4 fw-bold text-success">
          <i class="bi bi-person-add"></i> Registration
        </h5>
        <form @submit.prevent="handleRegistration">
          <div class="mb-3">
            <BaseInput label="Fullname" v-model="fullname" />
            <small class="text-danger" v-if="v$.fullname.$invalid && v$.fullname.$dirty">
              {{ v$.fullname.required ? 'Fullname is required' : '' }}
            </small>
          </div>

          <div class="mb-3">
            <BaseInput label="Email" v-model="email" type="email" />
            <small class="text-danger" v-if="v$.email.$invalid && v$.email.$dirty">
              {{ v$.email.required ? 'Email is required' : '' }}
            </small>
          </div>

          <div class="mb-3">
            <BaseInput label="Password" v-model="password" type="password" />
            <small class="text-danger" v-if="v$.password.$invalid && v$.password.$dirty">
              {{ v$.password.required ? 'Password is required' : '' }}
            </small>
          </div>

          <div class="mb-3">
            <BaseInput label="Confirm Password" v-model="confirmPassword" type="password" />
            <small class="text-danger" v-if="v$.confirmPassword.$invalid && v$.confirmPassword.$dirty">
              {{ v$.confirmPassword.required ? 'Confirm Password is required' : '' }}
            </small>
          </div>

          <div class="d-grid gap-2 col-12 mx-auto">
            <button class="btn btn-success" type="submit"> <i class="bi bi-check-lg"></i> Register</button>
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

<script>
import { ref } from 'vue';
import useVuelidate from '@vuelidate/core';
import { required, minLength, sameAs } from '@vuelidate/validators';
import BaseInput from '@/components/BaseInput.vue';

export default {
  name: 'RegisterView',
  components: { BaseInput },
  setup() {
    const fullname = ref('');
    const email = ref('');
    const password = ref('');
    const confirmPassword = ref('');

    const rules = {
      fullname: { required },
      email: { required, email },
      password: { required, minLength: minLength(8) },
      confirmPassword: { required, sameAsPassword: sameAs(password) },
    };

    const v$ = useVuelidate(rules, { fullname, email, password, confirmPassword });

    const handleRegistration = () => {
      v$.value.$touch();
      if (!v$.value.$invalid) {
        const data = {
          fullname: fullname.value,
          email: email.value,
          password: password.value,
          confirmPassword: confirmPassword.value,
        };
        console.log('Form Submitted:', data);
      } else {
        console.log('Validation Errors:', v$.value.$errors);
      }
    };

    return {
      fullname,
      email,
      password,
      confirmPassword,
      v$,
      handleRegistration,
    };
  },
};
</script>
