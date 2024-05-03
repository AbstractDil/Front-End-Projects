<script setup>
import NavBar from './components/NavBar.vue'
import FooTer from './components/FooTer.vue';
import {RouterView } from 'vue-router';

</script>

<script>
export default {
  name : "SagarVueApp",
  data(){
    return{
      //isDark : false,

    }
  },

  /*
  methods:{
    toggleDark(){
      this.isDark = !this.isDark;
    }
  }
  */

}


</script>

<template>

  
    <header>
    <NavBar appName = "Sagar Nandy" />
    </header>

    <RouterView />

   
      <FooTer/>
   
    


</template>


