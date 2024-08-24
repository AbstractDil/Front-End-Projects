<script setup>
import BaseInput from '@/components/BaseInput.vue';
import { reactive, computed, ref } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required, minLength, maxLength, sameAs } from '@vuelidate/validators';
import { getCurrentInstance } from 'vue';


const { proxy } = getCurrentInstance(); // Get the current instance's proxy

const formData = reactive({
  CurrentPassword:'',
  userPassword: '',
  usercPassword: '',
});

const formSubmitted = ref(false);

const rules = computed(() => ({
  CurrentPassword: {required, minLength: minLength(6), maxLength: maxLength(20)},
  userPassword: { required, minLength: minLength(6), maxLength: maxLength(20)},
  usercPassword: { required, sameAs: sameAs(formData.userPassword) },
}));

const v$ = useVuelidate(rules, formData);

const handleProfileUpdatePassword = async () => {
  formSubmitted.value = true;
  const result = await v$.value.$validate();
  console.log('Validation result:', result);
  console.log('Form data:', formData);

  if (result) {
    proxy.$swal.fire('Success!', 'Your password has been changed successfully!', 'success'); // Use proxy.$swal
  } else {
    proxy.$swal.fire('Warning!', 'Form validation errors! Please review the fields carefully.', 'warning');
  }
};




</script>

<template>
    <!-- Update Password Section Starts -->
    <div class="update-password container py-4">
        <div class="card p-3">
            <div class="card-body text-start">
                <h5 class="card-title text-start fw-bold text-success mx-2"> <i class="bi bi-shield-lock-fill"></i> Update Password</h5>
                <p class=" mx-3 font-sm text-muted"> Ensure your account is using a long, random password to stay secure.</p>
                <div class="container">
                    <div class="row">
                        <div class="col-md-6">
                            <form @submit.prevent="handleProfileUpdatePassword">
                                <BaseInput label="Current Password" v-model="formData.CurrentPassword" type="password" />

                                <p v-if="formSubmitted && v$.CurrentPassword.required.$invalid">
                                    <small class="text-danger">
                                   Please enter your current Password
                                    </small>
                                </p>
                                <p v-if="formSubmitted && !v$.CurrentPassword.required.$invalid && v$.CurrentPassword.minLength.$invalid">
                                    <small class="text-danger">
                                   Current password must be at least 6 characters long
                                    </small>
                                </p>
                                <p v-if="formSubmitted && !v$.CurrentPassword.required.$invalid && v$.CurrentPassword.maxLength.$invalid">
                                    <small class="text-danger">
                                   Current password cannot exceed 20 characters
                                    </small>
                                </p>

                                <BaseInput label="New Password" v-model="formData.userPassword" type="password" />

                                <p v-if="formSubmitted && v$.userPassword.required.$invalid">
                                    <small class="text-danger">
                                   Please enter a new password
                                    </small>
                                </p>
                                <p v-if="formSubmitted && !v$.userPassword.required.$invalid && v$.userPassword.minLength.$invalid">
                                    <small class="text-danger">
                                   New password must be at least 6 characters long
                                    </small>
                                </p>
                                <p v-if="formSubmitted && !v$.userPassword.required.$invalid && v$.userPassword.maxLength.$invalid">
                                    <small class="text-danger">
                                   New password cannot exceed 20 characters
                                    </small>
                                </p>
            
                                <BaseInput label="Confirm Password" v-model="formData.usercPassword" type="password" />
                                <p v-if="formSubmitted && v$.usercPassword.required.$invalid">
                                    <small class="text-danger">
                                    Confirm password is required
                                    </small>
                                </p>
                                <p v-if="formSubmitted && !v$.usercPassword.required.$invalid && v$.usercPassword.sameAs.$invalid">
                                    <small class="text-danger">
                                    Passwords do not match
                                    </small>
                                </p>
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
</template>

<script>
    export default {
        name:'ProfileUpdatePassword',
    }
</script>

<style lang="scss" scoped>

</style>