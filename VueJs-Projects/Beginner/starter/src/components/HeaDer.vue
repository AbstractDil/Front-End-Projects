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
                <h5 class=" mt-3 display-6">
                  <span v-if="title == 'About Me'"><i class="bi bi-person-lines-fill"></i> </span>
                  <span v-else-if="title == 'Contact Me'"><i class="bi bi-telephone-plus-fill"></i> </span>

                  {{ title }}
                </h5>
                <p>Lorem ipsum...</p>
            </div>

        </div>
    </div>
    <!-- Jumbtron Ends -->

</template>
