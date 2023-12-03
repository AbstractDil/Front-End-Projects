<script setup>
import { RouterLink,RouterView } from 'vue-router';
import NavbarSection from './components/NavbarSection.vue';

</script>


<template>

  <NavbarSection/>

<nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
</nav>
<RouterView />

</template>


