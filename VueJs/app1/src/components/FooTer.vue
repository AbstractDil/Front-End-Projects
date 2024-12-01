<template>
    <div class="d-flex flex-column min-vh-50">
      <!-- Your main content here -->
      
      <!-- Footer Starts -->
      <footer class="text-center text-lg-start  text-muted mt-auto">
        <section class="text-center pt-3 pb-0 border-top">
          © {{ currentYear }} - Developed by
          <a class="text-success" href="https://nandysagar.in/">Sagar Nandy</a>

          <p>Visitors Count: 
            <template v-if="loading">
              <p class="card-text placeholder-glow">
              <span class="placeholder col-1"></span>
             </p>
            </template>
             <template v-else>{{ visitorsCount }}</template>
          </p>
          
        </section>
      </footer>
      <!-- Footer Ends -->
    </div>
  </template>
  
  <script>
  import axios from '@/axios'; // Import your axios instance with baseURL
  export default {
    name: 'FooTer',
    data() {
    return {
      currentYear: new Date().getFullYear(),
      visitorsCount:0,
      loading:false
    };
  },

  methods: {

    async getVisitors(){

      this.loading = true;

      try{

        const response = await axios.get('/server-status');
        if (response.data.status === 200) {
          console.log("Success", response.data);
          this.visitorsCount = response.data.total_visitors;
        } else {
          console.log("Error in fetching data",response.data);
        }
      }catch(error){
        console.error('Error:', error);
      }finally {
        this.loading = false;
      }

    }

  },

  mounted() {
    this.getVisitors();
  },

  }
  </script>
 