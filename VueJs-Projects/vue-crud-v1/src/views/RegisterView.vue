<template>
  <div class="bg-body-tertiary min-vh-100 d-flex align-items-center justify-content-center">
    <!-- Card Starts -->
    <div class="card p-3" style="width:24em;">
      <div class="card-body text-start">
        <h5 class="card-title text-center mb-4 fw-bold text-success">
          <i class="bi bi-person-add"></i> Registration
        </h5>
        <form @submit.prevent="handleRegistration">
          <BaseInput label="Fullname" v-model="formData.userName" />
          <p>
            <small class="text-danger" v-for="error in v$.userName.$errors" :key="error.$uid">
              {{ error.$message || 'Fullname is required' }}
            </small>
          </p>

          <BaseInput label="Email" v-model="formData.userEmail" type="email" />
          <p>
            <small class="text-danger" v-for="error in v$.userEmail.$errors" :key="error.$uid">
              {{ error.$message || 'Email is required' }}
            </small>
          </p>

          <BaseInput label="Password" v-model="formData.userPassword" type="password" />
          <p>
            <small class="text-danger" v-for="error in v$.userPassword.$errors" :key="error.$uid">
              {{ error.$message || 'Password is required' }}
            </small>
          </p>

          <BaseInput label="Confirm Password" v-model="formData.usercPassword" type="password" />
          <p>
            <small class="text-danger" v-for="error in v$.usercPassword.$errors" :key="error.$uid">
              {{ error.$message || 'Confirm Password is required' }}
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
import { reactive, computed } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required, minLength, email, sameAs } from '@vuelidate/validators';

const formData = reactive({
  userName: '',
  userEmail: '',
  userPassword: '',
  usercPassword: '',
});

const rules = computed(() => ({
  userName: { required, minLength: minLength(3) },
  userEmail: { required, email },
  userPassword: { required },
  usercPassword: { required, sameAs: sameAs(formData.userPassword) },
}));

const v$ = useVuelidate(rules, formData);

const handleRegistration = async () => {
  console.log('Form data:', formData);
  const result = await v$.value.$validate();
  console.log(result);
  if (result) {
    alert('Success!! It is working');
    // Make an HTTP POST request to your backend API
  } else {
    alert('All fields are required to submit the form!');
  }
};
</script>

