<script setup>
import NavbarSection from './components/NavbarSection.vue';
import { RouterView } from 'vue-router';
import FooterSection from './components/FooterSection.vue';
</script>


<template>

<NavbarSection appName = "Triparna"/>

<RouterView />

<FooterSection/>

</template>


