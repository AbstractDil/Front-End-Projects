<template>
  <!-- Topbar Starts  -->
  <div class="bg-info position-relative">
    <div class="container text-white py-1">
      <p class="m-0 fs-6 list-inline">
        <i class="bi bi-alarm"></i> <span>
          <span id="ctopdate" class="mx-1">{{ formattedDateTime }}</span>
          <span id="ctoptimer">{{ formattedTime }}</span>
        </span>
        <span class="float-end">
          <!-- Dark Mode Btn -->
          <a href="https://mathhub.nandysagar.in/old_combined" target="_blank" title="Old Site" style="border:none;background-color:transparent;color:white;">
            <ins>
              <i class="bi bi-box-arrow-up-right"></i>
              Old Site
            </ins>
          </a>
          <!-- <i class="fa fa-adjust"></i> -->
        </span>
      </p>
    </div>
  </div>
  <!-- Topbar Ends -->
  <!-- Navbar Starts -->
  <nav class="navbar navbar-expand-lg border-bottom bg-white">
    <div class="container-fluid px-4">
      <RouterLink class="navbar-brand  logo-text mt-2" to="/home">
        {{ appName }}
      </RouterLink>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
          <li class="nav-item" v-for="url in urls" :key="url.id">
            <RouterLink class="nav-link active" v-bind:to="'/' + url.url">
              {{ url.url.charAt(0).toUpperCase() + url.url.slice(1) }}
            </RouterLink>
          </li>
        </ul>
      </div>
    </div>
  </nav>
  <!-- Navbar Ends -->
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';

const props = defineProps({
  appName: {
    type: String,
    required: true
  }
});

const urls = ref([
  { id: 1, url: 'home' },
  { id: 2, url: 'about' },
  { id: 3, url: 'registration' },
  { id: 4, url: 'login' }
]);

const formattedDateTime = ref('');
//const formattedTime = ref('');

const updateDateTime = () => {
  const options = {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric'
  };
  
  const currentDate = new Date();
  formattedDateTime.value = currentDate.toLocaleTimeString('en-US', options);
  //formattedTime.value = currentDate.toLocaleTimeString('en-US', options);
  
};

onMounted(() => {
  updateDateTime();
  setInterval(updateDateTime, 1000);
});
</script>

<style scoped>
.navbar-brand {
  font-weight: bold;
}
.logo-text {
  font-size: 20px;
}
p {
  font-size: 14px !important;
}
</style>
