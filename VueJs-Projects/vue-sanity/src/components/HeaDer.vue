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
            <div class=" p-5 text-white text-center jumbtron-body">
                <h5 class="text-center display-6 my-5">
                  <span v-if="title == 'About Me'"><i class="bi bi-person-lines-fill"></i> </span>
                  <span v-else-if="title == 'Contact Me'"><i class="bi bi-telephone-plus-fill"></i> </span>
                  <span v-else-if="title == 'Read My Blogs'"><i class="bi bi-book-fill"></i> </span>

                  {{ title }}
                </h5>
                <!-- <p>Lorem ipsum...</p> -->
            </div>

        </div>
    </div>
    <!-- Jumbtron Ends -->

</template>
