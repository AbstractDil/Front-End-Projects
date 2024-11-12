<template>
  <div class="bg-body-tertiary min-vh-100 ">
    <!-- Registration Form Card Starts -->
     <div v-if="!registrationSuccess" class="min-vh-100 d-flex align-items-center justify-content-center py-4"> 
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
               <button class="btn btn-success" type="submit" :disabled="loading">
                 <template v-if="loading">
                   <!-- Loader -->
                   <div class="spinner-border text-light spinner-border-sm" role="status">
                     <span class="visually-hidden">Loading...</span>
                   </div>
                 </template>
                 <template v-else>
                   <i class="bi bi-check-lg"></i>  Register
                 </template>
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
     </div>
    <!-- Registration Form Card Ends -->

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
import StatusMessage from '@/components/StatusMessage.vue';
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
const loading = ref(false); // Loader state
const registrationSuccess = ref(false); // Success state
const verificationToken = ref(''); // Store verification token


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
    loading.value = true; // Show the loader
    try {
      // Send a POST request to the backend
      const response = await axios.post('create-user', formData, {
            headers: {
        'Content-Type': 'application/json',
      },
      });

      // Handle success response
      proxy.$swal.fire('Success!', 'Verification email sent. Please check your inbox or spam folder.', 'success');
      console.log('Response from backend:', response.data);
     
        // Store verification token and set success state
        verificationToken.value = response.data.verification_token;
        registrationSuccess.value = true;



      // Reset form data after successful registration
      /*
      Object.keys(formData).forEach(key => {
        formData[key] = '';
      });
      
      // Optionally, reset validation state
      v$.value.$reset();
      */

    } catch (error) {
      // Handle error response
      console.error('Error during registration:', error.response.data);
        // Extract error status code and messages
        const statusCode = error.response.status;
      // Extract and concatenate error messages
      const errorMessages = Object.values(error.response.data.messages).join(' ');
      
      // Display error using SweetAlert2
      proxy.$swal.fire(`Error ${statusCode}!`, errorMessages || 'There was an error during registration. Please try again later.', 'error');

    }
    finally {
      loading.value = false; // Hide the loader after the request is fulfilled
    }
  } else {
    proxy.$swal.fire('Warning!', 'Form validation errors! Please review the fields carefully.', 'warning');
  }
};

// Redirect to login page
// Redirect to verify email page with token
const goToVerificationPage = () => {
  if (verificationToken.value) {
    proxy.$router.push(`/verify-email/${verificationToken.value}`);
  } else {
    console.error('No verification token available.');
  }
};
</script>
