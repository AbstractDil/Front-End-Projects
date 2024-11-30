<template>
    <section class="bg-body-tertiary py-4">
  
      <!-- Sender photo and name shown here starts -->
      <div class="container" v-if="userDetails">
      <div class="card mb-5 border-success">
        <div class="card-header bg-success text-white text-start">
          <i class="bi bi-info-circle-fill"></i> Sender Information
        </div>
        <div class="card-body d-flex justify-content-start align-items-center">
          <img 
            v-if="userDetails.profile_photo_path" 
            :src="userDetails.profile_photo_path" 
            alt="UserProfilePic"
            class="img-thumbnail profile-image rounded-circle mx-3">
          <h5>{{ userDetails.name }} is waiting for your response.</h5>
        </div>
      </div>
    </div>
  
      <!-- Sender photo and name shown here ends -->
  
      <!-- Form Starts Here -->
      <div class="container text-start">
        <div class="card my-5 border-success">
          <div class="card-header bg-success text-white text-start">
            <i class="bi bi-patch-question-fill"></i> Questions
          </div>
          <div class="card-body">
           
          </div>
        </div>
      </div>
      <!-- Form Ends Here -->
  
      <!-- Quotes Starts Here  -->
      <div class="container">
        <div class="card my-4 border-success">
          <div class="card-header bg-success text-white text-start">
            <i class="bi bi-chat-quote-fill"></i> Quotes
          </div>
          <div class="card-body">
            <blockquote class="blockquote mb-0 p-4">
              <p class="text-success">Zindegi Ka Safar Bade Suhana Hain, Akele Aye The, Akele Chala Jana Hain, Kya Karna
                Hain
                Iss Duniya Mein Risto Ko Banakar..., Ak Na Akdin Chale He Jana Hain...</p>
              <footer class="blockquote-footer">#Collected</footer>
            </blockquote>
          </div>
        </div>
        <!-- Quotes Ends Here -->
      </div>
    </section>
  </template>
  
  <script>
  //import axios from "axios";
  //import Swal from 'sweetalert2';
import { mapGetters} from 'vuex';

  
  export default {
    name: "FormResponses",
    data() {
      return {
        loading: false,
      };
    },

    computed: {
    ...mapGetters('auth', {
      // Retrieve userDetails from Vuex store
      userDetails: 'userDetails',
    }),
},
   
  };
  </script>
  
  <style scoped>
  .profile-image {
    width: 60px;
    height: 60px;
    object-fit: cover;
    border-radius: 50%;
    border: 2px solid #28a745;
  }
  
  .custom-input:focus {
    border-color: #42b983;
    /* Change this to your desired focus border color */
    box-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.25);
    /* Adjust this for your desired box shadow */
  }
  </style>