<template>
    <div class="container my-5">
        <div class="row">
            <div class="col-md-6 offset-md-3">
                <div class="d-flex justify-content-center align-items-center">
                    <!--  Card Starts  -->
                    <div class="card p-3" style="width: 24em;">
                        <div class="card-body">
                            <h5 class="card-title text-center mb-4">{{ subtitle }}</h5>
                            <form @submit.prevent="submitForm">
                                <div class="mb-3">
                                    <label class="form-label">Email</label>
                                    <input type="email" class="form-control" v-model="userEmail" required />
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Password</label>
                                    <input type="password" class="form-control" v-model="userPassword" required />
                                </div>
                                <div class="d-grid gap-2 col-12 mx-auto">
                                    <button class="btn btn-primary text-light my-3" type="submit">Login</button>
                                </div>
                            </form>
                            <p class="text-muted mt-4 fs-14px text-center">
                                Don't have an account? <RouterLink to="/registration">Register Now</RouterLink>
                            </p>
                        </div>
                    </div>
                    <!-- Card Ends -->
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "LoginForm",
    props: {
        subtitle: {
        type: String,
        required: true
       },
    },
    data() {
        return {
            userEmail: '',
            userPassword: '',
        };
    },
    methods: {
        submitForm() {
            console.log('Email:', this.userEmail);
            console.log('Password:', this.userPassword);
            // Add logic for form submission, such as API calls
        }
    }
};
</script>

<style scoped>
/* Add any custom styles here */
</style>
