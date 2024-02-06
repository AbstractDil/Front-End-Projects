<script setup>
  import {useDark,useToggle} from "@vueuse/core";
import {RouterLink } from 'vue-router';

defineProps({
  appName: {
    type: String,
    required: true
  }
})


const isDark = useDark({
  selector: "body", //element to add attribute to
  attribute: "data-bs-theme", // attribute name
  valueDark: "dark", // attribute value for dark mode
  valueLight: "light", // attribute value for light mode

});
const toggleDark = useToggle(isDark);

</script>

<template>
    <nav class="navbar navbar-expand-lg border-bottom" 
    v-bind:class="isDark ? 'bg-dark' : ''"
    v-bind:data-bs-theme = "isDark ? 'dark' : ''"
    >
  <div class="container-fluid px-4">
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <i class="bi bi-list"></i>
    </button>
    <a class="navbar-brand  logo-text mt-2" href="/home">
      <img src="../assets/img/TriparnaAbout.jpg" v-bind:alt="appName " v-bind:title="appName" class="mx-2 mb-2 border rounded-circle border-3 border-info logo-img" width="35" height="35">
      {{ appName.toUpperCase() }}
    </a>
    <button type="button" class="btn btn-sm d-lg-none" v-on:click="toggleDark()"
            v-bind:class="isDark ? 'btn-light' : 'btn-dark'"
          >
          <i class="bi" v-bind:class=" isDark ?  'bi-brightness-high-fill' : 'bi-moon-stars-fill'"></i>
            
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

         <!-- <li class="nav-item">
        <RouterLink class="nav-link" to="/about">About</RouterLink>

         </li> -->

         <li class="nav-item">
          <button type="button" class="btn" v-on:click="toggleDark()"
            v-bind:class="isDark ? 'btn-light' : 'btn-dark'"
          >
          <i class="bi" v-bind:class=" isDark ?  'bi-brightness-high-fill' : 'bi-moon-stars-fill'"></i>
            {{ isDark ? 'Light' : 'Dark'}}
          </button>
         </li>
       
       
        <!-- <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            Dropdown
          </a>
          <ul class="dropdown-menu">
            <li><a class="dropdown-item" href="#">Action</a></li>
            <li><a class="dropdown-item" href="#">Another action</a></li>
            <li><hr class="dropdown-divider"></li>
            <li><a class="dropdown-item" href="#">Something else here</a></li>
          </ul>
        </li> -->
       
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

@media only screen and (max-width: 600px){
  .container-fluid{
    padding-left:12px !important;
  }
  .logo-img{
    margin-left:2px !important;
  }
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
        {id :3 ,  url: 'education'},
        {id :4,  url: 'contact'},

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