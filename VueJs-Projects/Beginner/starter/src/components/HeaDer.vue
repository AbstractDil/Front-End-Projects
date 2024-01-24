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
                <h5 class=" mt-3 display-6"><i class="bi bi-person-lines-fill"></i> {{ title }}</h5>
                <p>Lorem ipsum...</p>
            </div>

        </div>
    </div>
    <!-- Jumbtron Ends -->

</template>
