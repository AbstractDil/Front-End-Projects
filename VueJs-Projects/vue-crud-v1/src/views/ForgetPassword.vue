<script setup>
import { reactive } from 'vue';
import BaseInput from '@/components/BaseInput.vue';


const formData = reactive({
  userName: "",
  userEmail: "",
  userPassword: "",
  usercPassword: "",
});

function submitForm() {
  console.log(formData);
  // Handle form submission
}
</script>

<template>
  <div class="bg-body-tertiary min-vh-100 d-flex align-items-center justify-content-center">
    <div class="card p-3" style="width:24em;">
      <div class="card-body text-start">
        <h5 class="card-title text-center mb-4 fw-bold text-success">Forget Password</h5>
        <form @submit.prevent="submitForm">
          
          <BaseInput label="Email" v-model="formData.userEmail" type="email" />
          
          
          <div class="d-grid gap-2 col-12 mx-auto">
            <button class="btn btn-success" type="submit"><i class="bi bi-check-lg"></i> Verify email</button>
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
  </div>
</template>

