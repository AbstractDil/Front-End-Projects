<script setup>
import BaseInput from '@/components/BaseInput.vue';
import { reactive, computed, ref } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required, minLength, maxLength, sameAs } from '@vuelidate/validators';
import { useStore } from 'vuex'; // Import useStore for Vuex
import { getCurrentInstance } from 'vue';
import { useRouter } from 'vue-router'; // Import useRouter
import axios from 'axios';

const { proxy } = getCurrentInstance();
const router = useRouter(); 
const passwordVisible = ref(false);

const store = useStore(); // Access Vuex store

const loading = ref(false);

const formData = reactive({
  CurrentPassword: '',
  userPassword: '',
  userCPassword: '',
});

const formSubmitted = ref(false);

const rules = computed(() => ({
  CurrentPassword: { required, minLength: minLength(6), maxLength: maxLength(20) },
  userPassword: { required, minLength: minLength(6), maxLength: maxLength(20) },
  userCPassword: { required, sameAs: sameAs(formData.userPassword) },
}));

const v$ = useVuelidate(rules, formData);

const togglePassword = () =>{
  passwordVisible.value = !passwordVisible.value;
}

const handleProfileUpdatePassword = async () => {
  formSubmitted.value = true;
  const result = await v$.value.$validate();
  console.log('Validation result:', result);
  console.log('Form data:', formData);

  if (result) {
    loading.value = true;

    // Get token and userId from Vuex store
    const token = store.state.auth?.token; // Access auth module's token
    const userId = store.state.auth?.userId; // Access auth module's userId


    try {
      const response = await axios.post(`update-password/${userId}`, formData, {
       /* headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        */
      });

     // Logout and redirect to login
      store.dispatch('auth/logout').then(() => {
        router.push('/'); // Redirect to login page
      });
      console.log('API response:', response.data);

      proxy.$swal.fire('Success!', 'Your password has been changed successfully! Please login again.', 'success');
    } catch (error) {
      if (error.response) {
        const statusCode = error.response.status;
        const errorMessages = Object.values(error.response.data.messages).join(' ') || 'An unexpected error occurred.';
        proxy.$swal.fire(`Error ${statusCode}!`, errorMessages, 'error');
      } else {
        proxy.$swal.fire('Connection Error!', 'Backend server is not responding. Please try again later.', 'error');
      }
    } finally {
      loading.value = false;
    }
  } else {
    proxy.$swal.fire('Warning!', 'Form validation errors! Please review the fields carefully.', 'warning');
  }
};
</script>

<template>
    <!-- Update Password Section Starts -->
    <div class="update-password container py-4">
        <div class="card p-3">
            <div class="card-body text-start">
                <h5 class="card-title text-start fw-bold text-success mx-2"> <i class="bi bi-shield-lock-fill"></i> Update Password</h5>
                <p class=" mx-3 font-sm text-muted"> Ensure your account is using a long, random password to stay secure.</p>
                <div class="container">
                    <div class="row">
                        <div class="col-md-6">
                            <form @submit.prevent="handleProfileUpdatePassword">
                                <BaseInput label="Current Password" v-model="formData.CurrentPassword" v-bind:type="passwordVisible? 'text' : 'password'" />
                                <i class="toggle-password bi" :class="passwordVisible ? 'bi-eye-fill' : 'bi-eye-slash-fill'" @click="togglePassword()"></i>
                                <p v-if="formSubmitted && v$.CurrentPassword.required.$invalid">
                                    <small class="text-danger">
                                   Please enter your current Password
                                    </small>
                                </p>
                                <p v-if="formSubmitted && !v$.CurrentPassword.required.$invalid && v$.CurrentPassword.minLength.$invalid">
                                    <small class="text-danger">
                                   Current password must be at least 6 characters long
                                    </small>
                                </p>
                                <p v-if="formSubmitted && !v$.CurrentPassword.required.$invalid && v$.CurrentPassword.maxLength.$invalid">
                                    <small class="text-danger">
                                   Current password cannot exceed 20 characters
                                    </small>
                                </p>

                                <BaseInput label="New Password" v-model="formData.userPassword" v-bind:type="passwordVisible? 'text' : 'password'" />
                                <i class="toggle-password bi" :class="passwordVisible ? 'bi-eye-fill' : 'bi-eye-slash-fill'" @click="togglePassword()"></i>
                                <p v-if="formSubmitted && v$.userPassword.required.$invalid">
                                    <small class="text-danger">
                                   Please enter a new password
                                    </small>
                                </p>
                                <p v-if="formSubmitted && !v$.userPassword.required.$invalid && v$.userPassword.minLength.$invalid">
                                    <small class="text-danger">
                                   New password must be at least 6 characters long
                                    </small>
                                </p>
                                <p v-if="formSubmitted && !v$.userPassword.required.$invalid && v$.userPassword.maxLength.$invalid">
                                    <small class="text-danger">
                                   New password cannot exceed 20 characters
                                    </small>
                                </p>
            
                                <BaseInput label="Confirm Password" v-model="formData.userCPassword" v-bind:type="passwordVisible? 'text' : 'password'" />
                                <i class="toggle-password bi" :class="passwordVisible ? 'bi-eye-fill' : 'bi-eye-slash-fill'" @click="togglePassword()"></i>
                                <p v-if="formSubmitted && v$.userCPassword.required.$invalid">
                                    <small class="text-danger">
                                    Confirm password is required
                                    </small>
                                </p>
                                <p v-if="formSubmitted && !v$.userCPassword.required.$invalid && v$.userCPassword.sameAs.$invalid">
                                    <small class="text-danger">
                                    Passwords do not match
                                    </small>
                                </p>
                             <div class="text-start">
                              <button class="btn btn-success" type="submit" :disabled="loading"> 
                                <template v-if="loading">
                                <div class="spinner-border text-light spinner-border-sm" role="status">
                                    <span class="visually-hidden">Loading...</span>
                                </div>
                                Processing...
                                </template>
                                <template v-else>
                                    <i class="bi bi-check-lg"></i> Save Changes
                                </template>
                            </button>
                            </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- Update Password Section Ends -->
</template>

<script>
    export default {
        name:'ProfileUpdatePassword',
    }
</script>

<style lang="scss" scoped>

</style>