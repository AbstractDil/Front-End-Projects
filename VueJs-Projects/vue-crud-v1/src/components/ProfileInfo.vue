<script setup>
import BaseInput from '@/components/BaseInput.vue';
import { reactive, computed, ref } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required, minLength, maxLength, email } from '@vuelidate/validators';
import { getCurrentInstance } from 'vue';


const { proxy } = getCurrentInstance(); // Get the current instance's proxy

const formData = reactive({
  userName: '',
  userEmail: '',
});

const formSubmitted = ref(false);

const rules = computed(() => ({
  userName: { required, minLength: minLength(3), maxLength: maxLength(30) },
  userEmail: { required, email, minLength: minLength(6),maxLength: maxLength(50) },
}));

const v$ = useVuelidate(rules, formData);

const handleProfileInfoUpdate = async () => {
  formSubmitted.value = true;
  const result = await v$.value.$validate();
  console.log('Validation result:', result);
  console.log('Form data:', formData);

  if (result) {
    proxy.$swal.fire('Success!', 'Registration was successful!', 'success'); // Use proxy.$swal
  } else {
    proxy.$swal.fire('Warning!', 'Form validation errors! Please review the fields carefully.', 'warning');
  }
};


// Profile Image
const profileImage = ref('/Images/User-avatar.png'); // Updated path

function onImageChange(event) {
  const file = event.target.files[0];
  if (file) {
    profileImage.value = URL.createObjectURL(file);
  }
}


</script>

<template>
    <!-- Profile Information section  Starts -->
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
                  <label for="file-upload" class="btn btn-outline-success"> <i class="bi bi-cloud-arrow-up-fill"></i> Upload Photo</label>
                </div>
              </div>
              </div>
              <!-- Form Section -->
              <div class="col-md-6">
              <form @submit.prevent="handleProfileInfoUpdate">
                <BaseInput label="Fullname" v-model="formData.userName" />
                <p v-if="formSubmitted && v$.userName.required.$invalid">
                    <small class="text-danger">
                    Fullname is required
                    </small>
                </p>
                <p v-if="formSubmitted && !v$.userName.required.$invalid && v$.userName.minLength.$invalid">
                    <small class="text-danger">
                    Minimum length is 3 characters
                    </small>
                </p>

                <p v-if="formSubmitted && !v$.userName.required.$invalid && v$.userName.maxLength.$invalid">
                    <small class="text-danger">
                    Maximum length is 20 characters
                    </small>
                </p>
                <BaseInput label="Email" v-model="formData.userEmail" type="email" />
                <p v-if="formSubmitted && v$.userEmail.required.$invalid">
            <small class="text-danger">
              Email is required
            </small>
          </p>
          <p v-if="formSubmitted && !v$.userEmail.required.$invalid && v$.userEmail.email.$invalid">
            <small class="text-danger">
              Please enter a valid email address
            </small>
          </p>

          <p v-if="formSubmitted && !v$.userEmail.required.$invalid && !v$.userEmail.email.$invalid && v$.userEmail.minLength.$invalid">
          <small class="text-danger">
            Email must be at least 6 characters long.
          </small>
        </p>

        <p v-if="formSubmitted && !v$.userEmail.required.$invalid && !v$.userEmail.email.$invalid && v$.userEmail.maxLength.$invalid">
          <small class="text-danger">
            Email cannot exceed 50 characters.
          </small>
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
    <!-- Profile Information section  Ends -->
</template>

<script>
    export default {
        name : 'ProfileInfo'
    }
</script>

<style  scoped>

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