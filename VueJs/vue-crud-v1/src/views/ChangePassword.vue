<script setup>
import BaseInput from '@/components/BaseInput.vue';
import { reactive, computed, ref } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required, minLength, maxLength, sameAs } from '@vuelidate/validators';
import { getCurrentInstance } from 'vue';

const { proxy } = getCurrentInstance(); // Get the current instance's proxy

const formData = reactive({
 // userName: '',
 // userEmail: '',
  userPassword: '',
  usercPassword: '',
});

const formSubmitted = ref(false);

const rules = computed(() => ({
  //userName: { required, minLength: minLength(3), maxLength: maxLength(30) },
 // userEmail: { required, email, minLength: minLength(6),maxLength: maxLength(50) },
  userPassword: { required, minLength: minLength(6), maxLength: maxLength(20)},
  usercPassword: { required, sameAs: sameAs(formData.userPassword) },
}));

const v$ = useVuelidate(rules, formData);

const handleChngPwdForm = async () => {
  formSubmitted.value = true;
  const result = await v$.value.$validate();
  console.log('Validation result:', result);
  console.log('Form data:', formData);

  if (result) {
    proxy.$swal.fire('Success!', ' Your password has been changed successfully!', 'success'); // Use proxy.$swal
  } else {
    proxy.$swal.fire('Warning!', 'Form validation errors! Please review the fields carefully.', 'warning');
  }
};
</script>

<template>
    <div class="bg-body-tertiary min-vh-100 d-flex align-items-center justify-content-center">

          <!--  Card Starts  -->
          <div class="card p-3" style="width:24em;">
            <div class="card-body text-start">
              <h5 class="card-title text-center mb-4 fw-bold text-success"><i class="bi bi-shield-lock"></i> Change Password</h5>
              <form @submit.prevent="handleChngPwdForm">
            
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

          <BaseInput label="Confirm Password" v-model="formData.usercPassword" type="password" />
          <p v-if="formSubmitted && v$.usercPassword.required.$invalid">
            <small class="text-danger">
              Confirm password is required
            </small>
          </p>
          <p v-if="formSubmitted && !v$.usercPassword.required.$invalid && v$.usercPassword.sameAs.$invalid">
            <small class="text-danger">
              Passwords do not match
            </small>
          </p>

                
                
                <div class="d-grid gap-2 col-12 mx-auto">
                  <button class="btn btn-success" type="submit">Confirm Changes</button>
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
          <!-- Card Ends -->
        </div>
    
</template>
