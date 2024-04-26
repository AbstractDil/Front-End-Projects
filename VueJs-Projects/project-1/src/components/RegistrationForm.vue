<script setup> 
 import BaseInput from './BaseInput.vue';
 import { reactive } from 'vue';
 //import {ref} from 'vue';
 import { useVuelidate } from '@vuelidate/core';
 import { required } from '@vuelidate/validators'

defineProps({
  subtitle: {
    type: String,
    required: true
  }
})
/*
const userEmail = ref("");
const userName = ref("");
const userPassword = ref("");
const usercPassword = ref("");
*/

const formData = reactive({

    userName:"",
    userEmail : "",
    userPassword : "",
    usercPassword : "",

});

const rules = {
    userName:{required},
    userEmail : {required},
    userPassword : {required},
    usercPassword : {required},
}

const v$ = useVuelidate(rules, formData);

const submitForm = async () => {
    const result = await v$.value.$validate();
    if(result){
        alert("Success!! It is working");
    }else{
        alert("Error!! There is a problem.");
    }
}

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
                        <form
                         @submit.prevent="submitForm"
                        >
                          <BaseInput label="Fullname" v-model="formData.userName"/>
                          <div class="invalid-feedback" 
                          v-for = "error in v$.userName.error"
                          :key="error.$uid"
                          >{{ error.$message }}</div>

                           <BaseInput label="Email" v-model="formData.userEmail" type="email"/>
                            
                           <BaseInput label="Password" v-model="formData.userPassword" type="password"/>

                           <BaseInput label="Confirm Password" v-model="formData.usercPassword" type="cpassword"/>


                           
                            <div class="d-grid gap-2 col-12 mx-auto">
                            <button class="btn btn-primary" type="submit">Registration</button>
                            <!-- <button class="btn btn-primary" type="button">Button</button> -->
                            </div>
                            </form>
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
        name : "RegistrationForm",
    }
</script>

