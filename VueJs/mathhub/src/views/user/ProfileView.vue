

<template>
    <section class="bg-body-tertiary py-4">
    
      <ProfileInfo/>

      <ProfileUpdatePassword/>


    <!-- Delete Account Section Starts -->
    <div class="delete-account container py-4">
        <div class="card p-3">
            <div class="card-body text-start">
                <h5 class="card-title text-start fw-bold text-dark-info mx-2"> <i class="bi bi-person-x-fill"></i> Delete Account </h5>
                <div class="container">
                    <div class="row">
                        <div class="col-md-6">
                <p class="font-sm text-muted"> 
                    Once your account is deleted, all of your resources and data will be permanently deleted. Before deleting your account, please download any data or information that 
                    you wish to retain.
                </p>
                <div class="text-start">
                <button class="btn btn-danger" type="submit" @click="confirmDelete"> <i class="bi bi-trash"></i> Delete Account
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
 import ProfileInfo from '@/components/user/ProfileInfo.vue';
 import ProfileUpdatePassword from '@/components/user/ProfileUpdatePassword.vue';
export default {
        name:'AccountProfile',
        components: {
       ProfileInfo,ProfileUpdatePassword
  }
    }
</script>

