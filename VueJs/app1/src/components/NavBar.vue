<template>
  <!-- App Navigation  Starts Here  -->
  <nav class="navbar navbar-expand-lg border-bottom"
    :class="isDark ? 'bg-dark' : ''"
    :data-bs-theme="isDark ? 'dark' : ''"
  >
    <div class="container px-4">
      <!-- Logo and App Title -->
      <router-link class="navbar-brand" to="/">
        <img width="30" height="30" alt="Vue logo" src="../assets/logo.png">
        <span class="mx-1 text-success">{{ appTitle }}</span>
      </router-link>

      <!-- Navbar Toggle Button (Mobile) -->
      <!-- <button class="btn btn-success btn-sm rounded d-lg-none" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <i class="bi bi-justify"></i>
      </button> -->

      <!-- Sidebar button for mobile  -->
      <button class="btn btn-success btn-sm rounded d-lg-none" type="button" data-bs-toggle="offcanvas" data-bs-target="#mobileSidebar" aria-controls="mobileSidebar">
        <i class="bi bi-justify"></i>
     </button>

      <!-- Navbar Links -->
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
          <!-- Login and Register Links (If Not Logged In) -->
          <li class="nav-item" v-if="!isLoggedIn">
              <router-link class="nav-link" to="/">
                <i class="bi bi-lock-fill"></i> Login
              </router-link>
            </li>
            <li class="nav-item" v-if="!isLoggedIn">
              <router-link class="nav-link" to="/register">
                <i class="bi bi-person-add"></i> Register
              </router-link>
            </li>

            <!-- Logout Button and User Initials (If Logged In) -->
            <!-- <li class="nav-item" v-else>
              <button class="btn btn-link nav-link" @click="handleLogout">
                <i class="bi bi-box-arrow-right"></i> Logout
              </button>
            </li> -->
            <!-- <li class="nav-item" v-if="userDetails && userDetails.name">
              <span class="nav-link">
                <i class="bi bi-person-circle"></i> {{ userDetails.name.charAt(0).toUpperCase() }}
              </span>
            </li> -->
           
            <li class="nav-item dropdown" v-if="isLoggedIn">
              <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Hello, 
                <span class="text-success">
                {{ userDetails.name }}
              </span>
              </a>
              <ul class="dropdown-menu">

                <li>
                <router-link class="dropdown-item text-muted" to="/dashboard">
                <i class="bi bi-speedometer2"></i> Dashboard
                </router-link>
                </li>

                <li>
                <router-link class="dropdown-item text-muted" to="/profile">
                <i class="bi bi-person-fill-gear"></i> Profile Settings
                </router-link>
                </li>
                <li><hr class="dropdown-divider"></li>
                <li class="text-center">
                  <button class="btn btn-danger" @click="handleLogout">
                <i class="bi bi-box-arrow-right"></i> Logout
              </button>
                </li>
              </ul>
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

  <!-- Sidebar for mobile starts -->
  <div class="offcanvas offcanvas-start" tabindex="-1" id="mobileSidebar" aria-labelledby="mobileSidebarLabel">
  <div class="offcanvas-header">
    <router-link class="navbar-brand" to="/">
        <img width="30" height="30" alt="Vue logo" src="../assets/logo.png">
        <span class="mx-1 text-success fs-5" id="mobileSidebarLabel">{{ appTitle }}</span>
    </router-link>
    <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
  </div>
  <div class="offcanvas-body text-start">
    <!-- Main Menu Starts -->
    <div class="main-menu">
      <h5 class="fw-bold mx-2" v-if="!isLoggedIn">Menu</h5>

      <p class="fw-bold mx-2 text-muted" v-if="isLoggedIn">
      Hello,
      <span class="text-success">
         {{ userDetails.name }}
      </span>
    </p>



      <ul class="list-group list-group-flush">
       
        <li class="list-group-item" v-if="!isLoggedIn">
              <router-link class="btn btn-outline-success" to="/">
                <i class="bi bi-lock-fill"></i> Existing User Login
              </router-link>
            </li>
            <li class="list-group-item" v-if="!isLoggedIn">
              <router-link class="btn btn-success" to="/register">
                <i class="bi bi-person-add"></i> New User Registration
              </router-link>
            </li>

            <!-- Logout Button and User Initials (If Logged In) -->

            <li class="list-group-item" v-if="isLoggedIn">
              <router-link class="nav-link" to="/dashboard">
                <i class="bi bi-speedometer2"></i> Dashboard
              </router-link>
            </li>
            
            <li class="list-group-item" v-if="isLoggedIn">
              <router-link class="nav-link" to="/profile">
                <i class="bi bi-person-fill-gear"></i> Profile Settings
              </router-link>
            </li>

            <li class="list-group-item"  v-if="isLoggedIn">
              <button class="btn btn-danger" @click="handleLogout">
                <i class="bi bi-box-arrow-right"></i> Logout
              </button>
            </li>

            <li class="list-group-item">
            <button type="button" class="btn " @click="toggleDark()"
              :class="isDark ? 'btn-dark' : 'btn-light'"
            >
              <i class="bi" :class="isDark ? 'bi-moon-stars-fill' : 'bi-brightness-high-fill'"></i>
              {{ isDark ? 'Dark Mode' : 'Light Mode' }}
            </button>
          </li>
      </ul>
    </div>
    <!-- Main Menu Ends -->
    
  </div>
</div>
  <!-- Sidebar for mobile ends -->

  <!-- App Navigation  Ends Here  -->


</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { useDark} from '@vueuse/core';

export default {
  name: 'NavBar',
  props: {
    appTitle: String,
  },
  data() {
    return {
      isDark: useDark({
        selector: 'body',
        attribute: 'data-bs-theme',
        valueDark: 'dark',
        valueLight: 'light',
      }),
    };
  },
  computed: {
    ...mapGetters('auth', {
      // Retrieve userDetails from Vuex store
      userDetails: 'userDetails',
      isLoggedIn: 'isLoggedIn',  
    }),
    userName() {
      return this.userDetails ? this.userDetails.name : 'Guest';
    },
  },
  methods: {
    ...mapActions('auth', {
      logout: 'logout',  // Map the Vuex action for logout
    }),
    toggleDark() {
      this.isDark = !this.isDark;  // Toggle dark mode manually
    },
    handleLogout() {
      this.logout();  // Dispatch logout action
      this.$router.push('/');  // Redirect to the login page after logout
    },
  },
  created() {
    console.log("User details:", this.userDetails);  // Debug to see the user details
  },
};

</script>


<style scoped>
/* Add any necessary styling here */
</style>
