<script setup>
import { ref,  onMounted } from 'vue';
import { useDark, useToggle } from "@vueuse/core";

// Dark mode setup
const isDark = useDark({
  selector: "body",
  attribute: "data-bs-theme",
  valueDark: "dark",
  valueLight: "light",
});
const toggleDark = useToggle(isDark);

// Reactive state for login status
const isLoggedIn = ref(false);
const userInitial = ref('');

// Check login state
const checkLoginState = () => {
  const token = localStorage.getItem('token');
  if (token) {
    // Decode token or fetch user info to get the user's first letter
    const userData = JSON.parse(atob(token.split('.')[1])); // Decoding JWT payload
    userInitial.value = userData.name ? userData.name.charAt(0).toUpperCase() : '';
    isLoggedIn.value = true;
  }
};

// Run check on component mount
onMounted(() => {
  checkLoginState();
});

// Handle logout
const handleLogout = () => {
  localStorage.removeItem('token');
  isLoggedIn.value = false;
  
};
</script>

<template>
  <nav class="navbar navbar-expand-lg border-bottom"
    :class="isDark ? 'bg-dark' : ''"
    :data-bs-theme="isDark ? 'dark' : ''"
  >
    <div class="container px-4">
      <router-link class="navbar-brand" to="/">
        <img width="30" height="30" alt="Vue logo" src="../assets/logo.png">
        {{ appTitle }}
      </router-link>
      <button class="btn btn-success btn-sm rounded d-lg-none" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <i class="bi bi-justify"></i>
      </button>
      
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
          <li class="nav-item" v-if="!isLoggedIn">
            <router-link class="nav-link" to="/"> <i class="bi bi-lock-fill"></i> Login</router-link>
          </li>
          <li class="nav-item" v-if="!isLoggedIn">
            <router-link class="nav-link" to="/register"> <i class="bi bi-person-add"></i> Register</router-link>
          </li>
          <li class="nav-item" v-else>
            <button class="btn btn-link nav-link" @click="handleLogout">
              <i class="bi bi-box-arrow-right"></i> Logout
            </button>
          </li>
          <li class="nav-item" v-if="isLoggedIn">
            <span class="nav-link">
              <i class="bi bi-person-circle"></i> {{ userInitial }}
            </span>
          </li>
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

<script>
export default {
  name: 'NavBar',
  props: {
    appTitle: String
  }
}
</script>


