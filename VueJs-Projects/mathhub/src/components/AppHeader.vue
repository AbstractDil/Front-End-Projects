<template>
  <!-- Topbar Starts  -->
  <div class="bg-info-subtle position-relative">
    <div class="container py-1">
      <small class="m-0 fs-14px list-inline">
        <i class="bi bi-alarm"></i> <span>
          <span id="ctopdate" class="mx-1">{{ formattedDateTime }}</span>
          <span id="ctoptimer">{{ formattedTime }}</span>
        </span>
        <span class="float-end">
          <!-- Dark Mode Btn -->
          <RouterLink to="/old_combined" target="_blank" title="Old Site" class="text-dark">
            <ins>
              <i class="bi bi-box-arrow-up-right"></i>
              Old Site
            </ins>
          </RouterLink>
          <!-- <i class="fa fa-adjust"></i> -->
        </span>
      </small>
    </div>
  </div>
  <!-- Topbar Ends -->

  <!-- header starts -->
  <header class="p-2 header bg-white border-bottom">
  <div class="container">
    <div class="row align-items-center">
      <div class="col-md-4 col-8 text-start d-flex align-items-center">
        <RouterLink to="/" class="d-flex align-items-center text-decoration-none">
          <img src="../../public/assets/Images/Logo.png" alt="MathHub Combined" height="60" width="60" class="rounded-circle">
          <h1 class="text-uppercase logo-title fw-bold ms-2 mb-0"> {{ firstLine }}<br />{{ secondLine }}</h1>
        </RouterLink>
      </div>
      <div class="col-md-8 col-4 text-end">
        <button v-if="isMobile" class=" btn btn-info" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <i class="bi bi-list"></i>
  </button>
        <RouterLink :to="loginLink" class="btn btn-primary text-light font-sm rounded-pill px-3 btn-login">
          <i class="bi bi-person-circle"></i> {{ loginText }}
        </RouterLink>
      </div>
    </div>
  </div>
</header>

  <!-- Header Ends -->
  
  <!-- Navbar Starts -->
  <nav class="navbar navbar-expand-lg border-bottom bg-white py-1">
    <div class="container-fluid px-4">
      <!-- <button class="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button> -->
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item" v-for="url in urls" :key="url.id">
            <RouterLink class="nav-link active" :to="'/' + url.url">
              {{ url.url.charAt(0).toUpperCase() + url.url.slice(1) }}
            </RouterLink>
          </li>
        </ul>
      </div>
    </div>
  </nav>
  <!-- Navbar Ends -->
</template>

<script>

import { useRoute } from 'vue-router';

export default {
  name: 'AppHeader',
  props: {
    appName: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      urls: [
        { id: 1, url: 'home' },
        { id: 2, url: 'about' },
        { id: 3, url: 'registration' },
        { id: 4, url: 'login' }
      ],
      formattedDateTime: '',
      isMobile: window.innerWidth <= 767
    };
  },
  computed: {
    loginText() {
      return this.route.path === '/login' ? 'Register' : 'Login';
    },
    loginLink() {
      return this.route.path === '/login' ? '/registration' : '/login';
    },
    firstLine() {
      return this.appName.split(' ')[0];
    },
    secondLine() {
      return this.appName.split(' ')[1] || '';
    }
  },
  created() {
    this.route = useRoute();
    this.updateDateTime();
    this.timer = setInterval(this.updateDateTime, 1000);
    window.addEventListener('resize', this.handleResize);
  },
  methods: {
    updateDateTime() {
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
      this.formattedDateTime = currentDate.toLocaleTimeString('en-US', options);
    },
    handleResize() {
      this.isMobile = window.innerWidth <= 767;
    }
  },
  beforeUnmount() {
    clearInterval(this.timer);
    window.removeEventListener('resize', this.handleResize);
  }
};
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
.navbar-toggler:hover {
  color: #fff !important;
  text-decoration: none;
  border: none !important;
}
</style>
