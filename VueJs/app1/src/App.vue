<script>
// Import the components
import NavBar from '@/components/NavBar.vue';
import ServerStatus from '@/components/ServerStatus.vue';
import FooTer from '@/components/FooTer.vue';
import LoadIng from '@/components/LoadIng.vue';

//import axios from '@/axios.js'; // Assuming axios is configured

export default {
  name: 'App',

  components: {
    ServerStatus,
    NavBar,
    FooTer,
    LoadIng
  },

  data() {
    return {
      appTitle: "iFriendShip",  // Define the appTitle
    };
  },

  
  /*
  async created() {
    try {
      // Get the token and userId from localStorage
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');

      // Ensure the userId and token are available before making the request
      if (userId && token) {
        // Fetch user data based on userId
        const response = await axios.get(`/show-user/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Dispatch the user data to Vuex store
        this.$store.dispatch('setUserData', response.data.user); // Ensure 'setUserData' matches your Vuex action
      } else {
        console.error('User is not logged in');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  },
  */
};
</script>

<template>
  <div>
    <NavBar :appTitle="appTitle" />
    <ServerStatus/>
    <LoadIng /> <!-- Dedicated loading component -->
    <router-view />
    <FooTer />
  </div>
</template>


<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>