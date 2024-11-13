<template> 
  <div class="bg-body-tertiary py-1">
    <div class="container-fluid">
    <div v-if="showAlert" class="alert alert-danger border-danger text-start alert-dismissible fade show" role="alert">
        <i class="bi bi-wifi-off fs-5"></i> Connection Error: Unable to connect with the backend server. Please try again later or contact your developer.
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
    <!-- <div v-else>
      Server is running!
    </div> -->
  </div>
</div>
</template>

<script>
import axios from '@/axios'; 

export default {
  name: 'ServerStatus',
  data() {
    return {
      isRunning: true,
      showAlert: false,
    };
  },
  methods: {
    async checkServer() {
      try {
        const response = await axios.get('/server-status');
        if (response.status === 200) {
          this.isRunning = true;
          this.showAlert = false; // Hide alert if status is 200
        } else {
          this.isRunning = false;
          this.showAlert = true; // Show alert for non-200 status
        }
      } catch (error) {
        console.error('Connection Error:', error);
        this.isRunning = false;
        this.showAlert = true; // Show alert on request failure
      }
    },
  },
  mounted() {
    this.checkServer(); // Check server status on component mount
  },
};
</script>


