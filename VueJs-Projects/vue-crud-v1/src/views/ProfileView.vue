<script setup>
import { ref, reactive } from 'vue';
import BaseInput from '@/components/BaseInput.vue';

const formData = reactive({
  userName: "",
  userEmail: "",
  //userPassword: "",
  //usercPassword: "",
});


// Profile Image
const profileImage = ref('/Images/User-avatar.png'); // Updated path

function onImageChange(event) {
  const file = event.target.files[0];
  if (file) {
    profileImage.value = URL.createObjectURL(file);
  }
}

function submitForm() {
  console.log(formData);
  // Handle form submission
}


</script>
<template>
    <section class="bg-body-tertiary py-4">
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
              <form @submit.prevent="submitForm">
                <BaseInput label="Fullname" v-model="formData.userName" />
                <BaseInput label="Email" v-model="formData.userEmail" type="email" />
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

    <!-- Update Password Section Starts -->
    <div class="update-password container py-4">
        <div class="card p-3">
            <div class="card-body text-start">
                <h5 class="card-title text-start fw-bold text-success mx-2"> <i class="bi bi-shield-lock-fill"></i> Update Password</h5>
                <p class=" mx-3 font-sm text-muted"> Ensure your account is using a long, random password to stay secure.</p>
                <div class="container">
                    <div class="row">
                        <div class="col-md-6">
                            <form @submit.prevent="submitForm">
                                <BaseInput label="Current Password" v-model="formData.currentPassword" type="password" />

                                <BaseInput label="New Password" v-model="formData.userPassword" type="password" />
            
                                <BaseInput label="Confirm Password" v-model="formData.usercPassword" type="password" />
                             <div class="text-start">
                              <button class="btn btn-success" type="submit"> <i class="bi bi-check-lg"></i> Save Changes
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


    <!-- Delete Account Section Starts -->
    <div class="delete-account container py-4">
        <div class="card p-3">
            <div class="card-body text-start">
                <h5 class="card-title text-start fw-bold text-success mx-2"> <i class="bi bi-person-x-fill"></i> Delete Account </h5>
                <div class="container">
                    <div class="row">
                        <div class="col-md-6">
                <p class="font-sm text-muted"> 
                    Once your account is deleted, all of your resources and data will be permanently deleted. Before deleting your account, please download any data or information that 
                    you wish to retain.
                </p>
                <div class="text-start">
                <button class="btn btn-danger" type="submit"> <i class="bi bi-trash"></i> Delete Account
                </button>
                </div>
            </div>
        </div>
    </div>
            </div>
        </div>
    </div>
    <!-- Delete Account Section Ends -->
   
   </section>
</template>

<script>
    export default {
        
    }
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
