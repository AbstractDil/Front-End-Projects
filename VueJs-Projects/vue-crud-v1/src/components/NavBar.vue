<script setup>
 import {useDark,useToggle} from "@vueuse/core";

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
  <div class="container px-4">
    <router-link class="navbar-brand"  to="/">
      <img width="30" height="30" alt="Vue logo" src="../assets/logo.png">
      {{appTitle}}</router-link>
    <button class="btn btn-success btn-sm rounded d-lg-none" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <i class="bi bi-justify"></i>
    </button>
    
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
        <li class="nav-item">
            <router-link  class="nav-link" to="/"> <i class="bi bi-lock-fill"></i> Login</router-link>
        </li>
        <li class="nav-item">
            <router-link class="nav-link" to="/register"> <i class="bi bi-person-add"></i> Register</router-link>
        </li>

        <li class="nav-item">
          <button type="button" class="btn btn-sm rounded my-1 " v-on:click="toggleDark()"
            v-bind:class="isDark ? 'btn-dark' : 'btn-light'"
          >
          <i class="bi" v-bind:class=" isDark ?  'bi-moon-stars-fill' : 'bi-brightness-high-fill'"></i>
            
          </button>
        </li>
       
      </ul>
      
    </div>
  </div>
</nav>
</template>

<script>
export default {
  name: 'NavBar',
  props: {
    appTitle: String
  }
}
</script>

<style lang="scss" scoped>

</style>