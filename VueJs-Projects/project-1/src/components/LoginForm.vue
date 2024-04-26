<script setup> 
import {RouterLink } from 'vue-router';
 import BaseInput from './BaseInput.vue';
 import {ref} from 'vue';
defineProps({
  subtitle: {
    type: String,
    required: true
  }
})

const userEmail = ref("");
const userPassword = ref("");

</script>

<template>
    <div class="container my-5">
        <div class="row">
            <div class="col-md-6 offset-md-3 ">
                <div class="d-flex justify-content-center align-items-center">
                    <!--  Card Starts  -->
                    <div class="card p-3" style="width:24em;">
                    <div class="card-body">
                        <h5 class="card-title text-center mb-4">{{subtitle}}</h5>
                        <form>
                           <BaseInput label="Email" v-model="userEmail"/>
                           <BaseInput label="Password" v-model="userPassword" type="password"/>

                           
                            <div class="d-grid gap-2 col-12 mx-auto">
                            <button class="btn btn-primary my-3" type="button">Login</button>
                            <!-- <button class="btn btn-primary" type="button">Button</button> -->
                        </div>
                    </form>
                    <p class="text-muted mt-4 fs-6">
                        Don't have an account, <RouterLink  to="/registration">Register Now</RouterLink>
                    </p>
                    </div>
                    </div>
                    <!-- Card Ends ------->

                </div>
            </div>
        </div>

    </div>
</template>

<script>
    export default {
        name : "LoginForm",
    }
</script>

