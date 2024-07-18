<script setup>
import {RouterLink } from 'vue-router';

defineProps({
  appName: {
    type: String,
    required: true
  }
})
</script>

<template>
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

        <!-- <li  class="nav-item" v-for="url in urls" :key="url.id"> -->

          <li class="nav-item" v-for="url in urls" :key="url.id">

          <RouterLink class="nav-link active" v-bind:to="'/'+url.url">
            {{ url.url.charAt(0).toUpperCase() + url.url.slice(1) }}
          </RouterLink>
          <!-- Reference  -->
            <!-- <a class="nav-link" v-bind:href="url.url"
             v-bind:class="(url.url == 'home' || url.url == 'about') ? 'active' : ''"
            > -->
              <!-- Id: {{ url.id }} => Name:  -->
              <!-- {{ url.url.charAt(0).toUpperCase() + url.url.slice(1) }} -->
            <!-- </a> -->
         </li>

    
       
      </ul>
    
    </div>
  </div>
</nav>
</template>

<style scoped>
.navbar-brand{
  font-weight: bold;
}
.logo-text{
  font-size:20px;
}


</style>
 
<script>
export default {
  name : "NavBar",
  data(){
    return{
      urls : [
        { id : 1,  url: 'home'},
        {id :2 ,  url: 'about'},
        {id :3 ,  url: 'registration'},
        {id :4,  url: 'login'},

      ],
     // isDark : false
    }
  },
 
 /* methods:{
    toggleDarkMode(){
      this.isDark = !this.isDark;
    }
  }
  */
}
</script>