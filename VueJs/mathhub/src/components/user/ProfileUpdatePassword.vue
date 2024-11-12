

<template>
    <!-- Update Password Section Starts -->
    <div class="update-password container py-4">
        <div class="card p-3">
            <div class="card-body text-start">
                <h5 class="card-title text-start fw-bold text-dark-info mx-2"> <i class="bi bi-shield-lock-fill"></i> Update Password</h5>
                <p class=" mx-3 font-sm text-muted"> Ensure your account is using a long, random password to stay secure.</p>
                <div class="container">
                    <div class="row">
                        <div class="col-md-6">
                            <form @submit.prevent="handleProfileUpdatePassword">
                                <div class="mb-3">
                                    <label class="form-label"> <i class="bi bi-lock"></i> Current password</label>
                                    <input type="password" class="form-control" >
                                </div>
                                <div class="mb-3">
                                    <label class="form-label"> <i class="bi bi-lock"></i> Enter new password</label>
                                    <input type="password" class="form-control" >
                                </div>
                                <div class="mb-3">
                                    <label class="form-label"> <i class="bi bi-lock"></i> Confirm new password</label>
                                    <input type="password" class="form-control" >
                                </div>
                               
                             <div class="text-start">
                              <button class="btn btn-primary" type="submit"> <i class="bi bi-check-lg"></i> Save Changes
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