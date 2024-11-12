<template>
  <nav class="navbar navbar-expand-lg border-bottom"
    :class="isDark ? 'bg-dark' : ''"
    :data-bs-theme="isDark ? 'dark' : ''"
  >
    <div class="container px-4">
      <!-- Logo and App Title -->
      <router-link class="navbar-brand" to="/">
        <img width="30" height="30" alt="Vue logo" src="../assets/logo.png">
        {{ appTitle }}
      </router-link>

      <!-- Navbar Toggle Button (Mobile) -->
      <button class="btn btn-success btn-sm rounded d-lg-none" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <i class="bi bi-justify"></i>
      </button>

      <!-- Navbar Links -->
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
          <!-- Login and Register Links (If Not Logged In) -->
          <li class="nav-item" v-if="!user">
            <router-link class="nav-link" to="/"> <i class="bi bi-lock-fill"></i> Login</router-link>
          </li>
          <li class="nav-item" v-if="!user">
            <router-link class="nav-link" to="/register"> <i class="bi bi-person-add"></i> Register</router-link>
          </li>

          <!-- Logout Button and User Initials (If Logged In) -->
          <li class="nav-item" v-else>
            <button class="btn btn-link nav-link" @click="handleLogout">
              <i class="bi bi-box-arrow-right"></i> Logout
            </button>
          </li>
          <li class="nav-item" v-if="user && user.name">
            <span class="nav-link">
              <i class="bi bi-person-circle"></i> {{ user.name.charAt(0).toUpperCase() }}
            </span>
          </li>

          <!-- Dark Mode Toggle Button -->
          <li class="nav-item">
            <button type="button" class="btn btn-sm rounded my-1" @click="toggleDark()"
              :class="isDark ? 'btn-dark' : 'btn-light'"
            >
              <i class="bi" :class="isDark ? 'bi-moon-stars-fill' : 'bi-brightness-high-fill'"></i>
            </button>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { useDark, useToggle } from '@vueuse/core';

// Vue Router
const router = useRouter();

// Vuex Store
const store = useStore();
const user = computed(() => store.getters.userId);  // Retrieve user from Vuex store
console.log("User details: " + user.value);  // Debug to see the user object

// Dark mode setup
const isDark = useDark({
  selector: 'body',
  attribute: 'data-bs-theme',
  valueDark: 'dark',
  valueLight: 'light',
});
const toggleDark = useToggle(isDark);

// Handle logout
const handleLogout = () => {
  store.dispatch('auth/logout');  // Dispatch a Vuex action to logout
  router.push('/');     // Redirect to the login page after logout
};
</script>

<script>
export default {
  name: 'NavBar',
  props: {
    appTitle: String,
  },
};
</script>

<style scoped>
/* Add any necessary styling here */
</style>
