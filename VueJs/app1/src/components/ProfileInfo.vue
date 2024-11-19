<template>
  <!-- Profile Information section Starts -->
  <div class="profile-information container py-4">
    <div class="card p-3">
      <div class="card-body text-start">
        <h5 class="card-title text-start fw-bold text-success mx-2">
          <i class="bi bi-person-fill"></i> Profile Information
        </h5>
        <p class="mx-3 font-sm text-muted mb-4">
          Update your account's profile information and email address
        </p>
        <div class="container">
          <div class="row">
            <!-- Profile Image Section -->
            <div class="col-md-4">
              <div class="text-center mt-2 mb-3">
                <img :src="profileImage" alt="Profile Picture" class="rounded-circle profile-image mb-3" />
                <div>
                  <input type="file" @change="onImageChange" id="file-upload" class="d-none" />
                  <label for="file-upload" class="btn btn-outline-success">
                    <i class="bi bi-cloud-arrow-up-fill"></i> Upload Photo
                  </label>
                </div>
              </div>
            </div>
            <!-- Form Section -->
            <div class="col-md-6">
              <form @submit.prevent="handleProfileInfoUpdate">
                <BaseInput label="Fullname" v-model="formData.name" />
               <!-- Name Validation Messages -->
                  <p v-if="formSubmitted && v$.formData.name.required.$invalid">
                    <small class="text-danger">Fullname is required</small>
                  </p>
                  <p v-if="formSubmitted && !v$.formData.name.required.$invalid && v$.formData.name.minLength.$invalid">
                    <small class="text-danger">Minimum length is 3 characters</small>
                  </p>
                  <p v-if="formSubmitted && !v$.formData.name.required.$invalid && v$.formData.name.maxLength.$invalid">
                    <small class="text-danger">Maximum length is 20 characters</small>
                  </p>
                <BaseInput label="Email" v-model="formData.email" type="email" />
               <!-- Email Validation Messages -->
              <p v-if="formSubmitted && v$.formData.email.required.$invalid">
                <small class="text-danger">Email is required</small>
              </p>
              <p v-if="formSubmitted && !v$.formData.email.required.$invalid && v$.formData.email.email.$invalid">
                <small class="text-danger">Please enter a valid email address</small>
              </p>
              <p v-if="formSubmitted && !v$.formData.email.required.$invalid && !v$.formData.email.email.$invalid && v$.formData.email.minLength.$invalid">
                <small class="text-danger">Email must be at least 6 characters long.</small>
              </p>
              <p v-if="formSubmitted && !v$.formData.email.required.$invalid && !v$.formData.email.email.$invalid && v$.formData.email.maxLength.$invalid">
                <small class="text-danger">Email cannot exceed 50 characters.</small>
              </p>
                <div class="text-start">
                  <button class="btn btn-success" type="submit">
                    <i class="bi bi-check-lg"></i> Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- Profile Information section Ends -->
</template>

<script>
import BaseInput from '@/components/BaseInput.vue';
import { required, minLength, maxLength, email } from '@vuelidate/validators';
import { useVuelidate } from '@vuelidate/core';
import axios from 'axios';

export default {
  name: 'ProfileInfo',
  components: { BaseInput },
  data() {
    return {
      formData: {
        name: '',
        email: '',
      },
      formSubmitted: false,
      profileImage: '/Images/User-avatar.png', // Updated path
      v$: null, // Placeholder for Vuelidate instance
    };
  },
  validations() {
    return {
      formData: {
        name: { required, minLength: minLength(3), maxLength: maxLength(30) },
        email: { required, email, minLength: minLength(6), maxLength: maxLength(50) },
      },
    };
  },
  created() {
    this.v$ = useVuelidate();
    this.fetchUserData();
  },
  methods: {
    async fetchUserData() {
      try {
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');

        if (userId && token) {
          const response = await axios.get(`/show-user/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          this.formData.name = response.data.data.name;
          this.formData.email = response.data.data.email;
        } else {
          console.error('User ID or token is not available');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    },
    async handleProfileInfoUpdate() {
      this.formSubmitted = true;
      const result = await this.v$.$validate();
      console.log('Validation result:', result);
      console.log('Form data:', this.formData);

      if (result) {
        try {
          const userId = localStorage.getItem('userId');
          const token = localStorage.getItem('token');
          const apiEndpoint = `update-user/${userId}`;

          const response = await axios.post(apiEndpoint, this.formData, {
            headers: { Authorization: `Bearer ${token}` },
          });

          this.$swal.fire('Success!', 'Profile updated successfully!', 'success');
          console.log('API response:', response.data);
        } catch (error) {
          this.$swal.fire('Error!', 'Failed to update profile. Please try again later.', 'error');
          console.error('API error:', error);
        }
      } else {
        this.$swal.fire('Warning!', 'Form validation errors! Please review the fields carefully.', 'warning');
      }
    },
    onImageChange(event) {
      const file = event.target.files[0];
      if (file) {
        this.profileImage = URL.createObjectURL(file);
      }
    },
  },
};
</script>

<style scoped>
.profile-image {
  width: 150px;
  height: 150px;
  object-fit: cover;
  border-radius: 50%;
  border: 2px solid #28a745;
}
.btn-outline-success {
  cursor: pointer;
}
</style>
