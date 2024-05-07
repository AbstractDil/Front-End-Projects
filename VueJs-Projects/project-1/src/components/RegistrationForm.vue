<script setup> 
 import BaseInput from './BaseInput.vue';
 import { reactive,computed } from 'vue';
 //import {ref} from 'vue';
 import { useVuelidate } from '@vuelidate/core';
 import { required,minLength,email,sameAs } from '@vuelidate/validators'
//import axios from 'axios'



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

const rules = computed(()=>{

    return{
        userName:{required, minLength:minLength(3)},
        userEmail : {required,email},
        userPassword : {required},
        usercPassword : {required,sameAs : sameAs(formData.userPassword)},
    }

});


const v$ = useVuelidate(rules, formData);

const submitForm = async () => {
    console.log("Form data:", formData); 
    const result = await v$.value.$validate();
    console.log(result);
    if (result) {
        alert("Success!! It is working");
        // Make an HTTP POST request to your backend API
        /*
        axios.post('http://localhost:3000/api/user/register', formData.value)
          .then(response => {
            // Handle response if needed
            console.log(response.data);
          })
          .catch(error => {
            // Handle error
            console.error('Error submitting form:', error);
          });
          */
      } else{
        alert("All fields are required to submit the form!");
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
                           <p>

                               <small class="text-danger" 
                               v-for = "error in v$.userName.$errors"
                               :key="error.$uid"
                               >{{ error.$message }}</small>
                           </p>

                           <BaseInput label="Email" v-model="formData.userEmail" type="email"/>
                           <p>

                               <small class="text-danger" 
                              v-for = "error in v$.userEmail.$errors"
                              :key="error.$uid"
                              >{{ error.$message }}</small>
                           </p>
                            
                           <BaseInput label="Password" v-model="formData.userPassword" type="password"/>
                           <p>
                               <small class="text-danger" 
                              v-for = "error in v$.userPassword.$errors"
                              :key="error.$uid"
                              >{{ error.$message }}</small>

                           </p>

                           <BaseInput label="Confirm Password" v-model="formData.usercPassword" type="password"/>

                           <p>
                               <small class="text-danger" 
                              v-for = "error in v$.usercPassword.$errors"
                              :key="error.$uid"
                              >{{ error.$message }}</small>

                           </p>


                           
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

