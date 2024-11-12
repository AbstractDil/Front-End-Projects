
<template>
    <!-- Profile Information section  Starts -->
    <div class="profile-information container py-4">
    <div class="card p-3">
      <div class="card-body text-start">
        <h5 class="card-title text-start fw-bold text-dark-info mx-2">
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
                  <label for="file-upload" class="btn btn-outline-primary"> <i class="bi bi-cloud-arrow-up-fill"></i> Upload Photo</label>
                </div>
              </div>
              </div>
              <!-- Form Section -->
              <div class="col-md-6">
              <form @submit.prevent="handleProfileInfoUpdate">
                <fieldset disabled>
                <div class="mb-3">
                  <label class="form-label">Fullname</label>
                  <input type="text" class="form-control" >
               </div>
               <div class="mb-3">
                  <label class="form-label">Email</label>
                  <input type="email" class="form-control" >
               </div>
              
                <div class="text-start">
                  <button class="btn btn-primary" type="submit">
                    <i class="bi bi-check-lg"></i> Save Changes
                  </button>
                </div>
              </fieldset>
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
        name : 'ProfileInfo',
        data(){
          return{
             profileImage: '/assets/Images/ProfileImage.png'
          }
        }
    }
</script>

<style  scoped>

.profile-image {
  width: 150px;
  height: 150px;
  object-fit: cover;
  border-radius: 50%;
  border: 2px solid #047a83;
}

.btn-outline-success {
  cursor: pointer;
}

</style>