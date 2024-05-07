<script setup> 
import {RouterLink } from 'vue-router';

defineProps({
  subtitle: {
    type: String,
    required: true
  }
})



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
                        <form @submit.prevent="handleForm">
                        <div class="mb-3">
                         <label  class="form-label">Fullname</label>
                           <input type="text"  class="form-control" v-model="userName"/>
                           </div>
                         <div class="mb-3">
                         <label  class="form-label">Email</label>
                           <input type="email"  class="form-control"  v-model="userEmail"/>
                           </div>
                           <div class="mb-3">
                         <label  class="form-label">Password</label>
                           <input  class="form-control"  v-model="userPassword" type="password"/>
                           </div>

                           <div class="mb-3">
                         <label  class="form-label">Confirm Password</label>
                           <input  class="form-control"  v-model="userCPassword" type="password"/>
                           </div>

                           
                            <div class="d-grid gap-2 col-12 mx-auto">
                            <button class="btn btn-primary my-3" type="submit">Register</button>
                            <!-- <button class="btn btn-primary" type="button">Button</button> -->
                        </div>
                    </form>
                    <p class="text-muted mt-4 fs-6">
                       Already have an account, <RouterLink  to="/login">Login Now</RouterLink>
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
        name : "RegForm",
    }
</script>
