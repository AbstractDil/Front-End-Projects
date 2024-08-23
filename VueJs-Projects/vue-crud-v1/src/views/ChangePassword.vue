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

          <!--  Card Starts  -->
          <div class="card p-3" style="width:24em;">
            <div class="card-body text-start">
              <h5 class="card-title text-center mb-4 fw-bold text-success">Change Password</h5>
              <form @submit.prevent="submitForm">
            
                <BaseInput label="Password" v-model="formData.userPassword" type="password" />
                

                <BaseInput label="Confirm Password" v-model="formData.usercPassword" type="password" />
                
                
                <div class="d-grid gap-2 col-12 mx-auto">
                  <button class="btn btn-success" type="submit">Confirm Changes</button>
                </div>
              </form>
            </div>
          </div>
          <!-- Card Ends -->
        </div>
    
</template>
