<template>
    <div class="bg-body-tertiary min-vh-100">
      <StatusMessage
        :visible="verificationStatus !== 'verifying'"
        :title="statusTitle"
        :message="statusMessage"
        :icon="statusIcon"
        :iconClass="iconClass"
        :buttonText="buttonText"
        :buttonColour="buttonColour"
        @button-click="goToLoginPage"
      />
    </div>
  </template>
  
  <script setup>
  import StatusMessage from '@/components/StatusMessage.vue';
  import axios from 'axios';
  import { ref, onMounted, computed } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { getCurrentInstance } from 'vue';
  
  // Reactive state
  const verificationStatus = ref('verifying'); // Initialize status as 'verifying'
  const statusMessage = ref(''); // For dynamic error/success messages
  const route = useRoute();
  const router = useRouter();
  const { proxy } = getCurrentInstance();
  
  // Compute title, icon, and button text based on verification status
  const statusTitle = computed(() => {
    return verificationStatus.value === 'success' ? 'Email Verified Successfully' :
           verificationStatus.value === 'failure' ? 'Email Verification Failed' :
           'Verifying Email';
  });
  
  const statusIcon = computed(() => {
    return verificationStatus.value === 'success' ? 'bi bi-patch-check-fill' :
           verificationStatus.value === 'failure' ? 'bi bi-x-circle-fill' :
           'bi bi-hourglass-split';
  });

  const iconClass = computed(() => {
    return verificationStatus.value === 'success' ? 'text-success' :
           verificationStatus.value === 'failure' ? 'text-danger' :
           'text-success';
  });


  const buttonColour = computed(() => {
    return verificationStatus.value === 'success' ? 'btn-success' : 
           verificationStatus.value === 'failure' ? 'btn-danger' : '';
  });
  
  const buttonText = computed(() => {
    return verificationStatus.value === 'success' ? 'Go to Login' : 
           verificationStatus.value === 'failure' ? 'Back to home' : '';
  });
  
  // Fetch token and verify email
  onMounted(async () => {
    const token = route.params.token;
    try {
      const response = await axios.get(`verify-email/${token}`);
      console.log(response.data.message);
      verificationStatus.value = 'success'; // Update status on success
      statusMessage.value = 'Your email has been successfully verified. You can now log in.';
    } catch (error) {
      if (!error.response) {
        proxy.$swal.fire('Connection Error!', 'Backend server is not responding. Please try again later...', 'error');
      } else {
      console.error('Verification failed:', error.response.data);
      verificationStatus.value = 'failure'; // Update status on failure
      statusMessage.value = error.response.data.messages.error + " Please try again." || 'There was a problem verifying your email. Please try again or contact support.';
    }
  }
  });
  
  // Handle button click
  const goToLoginPage = () => {
    if (verificationStatus.value === 'success') {
      router.push('/'); // Redirect to login or home page
    }
    router.push('/');
  };
  </script>
  

  