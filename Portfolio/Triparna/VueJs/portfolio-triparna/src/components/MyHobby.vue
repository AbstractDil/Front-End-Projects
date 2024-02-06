<template>

    <!-- hobbies Section Starts Here -->
    
        <div>
    
        <div class="container px-4 py-5" id="featured-3">
        <h2 class="pb-2 border-bottom"><i class="bi bi-person-workspace"></i> My Hobby</h2>
        <div class="row g-3 gap-3 py-5 row-cols-1 row-cols-lg-4 ">
          <div class="alert alert-info " v-for="hobby in hobbies" :key="hobby.id">

              <div class="feature col d-flex align-items-center justify-content-start"  >
                <div class="feature-icon d-flex align-items-center justify-content-center text-bg-info bg-gradient fs-2 mb-3">
                    <i class="bi bi-person-hearts"></i>
                </div>
                <h3 class="fs-4 text-body-emphasis mx-3">{{ hobby.hobby }}</h3>
              </div>
          </div>
         
        </div>
      </div>
    
        </div>
    <!-- hobbies Section Ends Here -->
    
    </template>
    
    <script>
        export default {
            components: "hobbies",
            data(){
              return{
                hobbies : [
                  { id : 1,  hobby: 'Trading'},
                  {id :2 ,  hobby: 'Movie'},
                  {id : 3 ,  hobby: ' Guiter'},
                  {id : 3 ,  hobby: 'Singing'},

                ],
              // isDark : false
              }
      },
        }
    </script>
    
    <style  scoped>
    
    .feature-icon {
        width: 4rem;
        height: 4rem;
        border-radius: 0.75rem;
    }
    
    </style>