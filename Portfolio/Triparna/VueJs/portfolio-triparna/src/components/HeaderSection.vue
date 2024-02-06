<script setup>
defineProps({
  title: {
    type: String,
    required: true
  }
})
</script>

<template>
    <!-- Jumbtron Starts -->
       <div class="jumbtron">
        <div class="overlay">
            <div class=" p-5 text-white text-center jumbtron-body ">
                <h5 class="mt-3 display-6">
                  <img src="../assets/img/TriparnaAbout.jpg"  class="mx-2 mb-2 border rounded-circle border-info logo-img" width="35" height="35">

                  {{ title }}
                </h5>
                
              
              
                <div class="d-flex align-items-center justify-content-center" >
                     
                  <nav aria-label="breadcrumb" class="">
                      <ol class="breadcrumb text-center">
                        <li class="breadcrumb-item">
                          <a href="home">Home </a>
                          
                        </li>
                        <i class="bi bi-caret-right-fill"></i>
                        <li v-if="title == 'About Me'" class="breadcrumb-item active" aria-current="page">
                        <span class="text-light" >About </span>
                           
                        </li>
                         <li v-else-if="title == 'Contact Me'" class="breadcrumb-item active text-light" >Contact</li>

                         <li v-else-if="title == 'My Education'" class="breadcrumb-item active text-light" >Education</li>
                      </ol>
                    </nav>
                </div>
            </div>


        </div>
    </div>
    <!-- Jumbtron Ends -->

</template>