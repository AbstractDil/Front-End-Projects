<template>
    <div class="d-flex flex-column min-vh-50">
      <!-- Your main content here -->
      
      <!-- Footer Starts -->
      <footer class="text-center text-lg-start  text-muted mt-auto">
        <section class="text-center p-3 border-top">
          © {{ currentYear }} - Developed by
          <a class="text-success" href="https://nandysagar.in/">Sagar Nandy</a>
        </section>
      </footer>
      <!-- Footer Ends -->
    </div>
  </template>
  
  <script>
  export default {
    name: 'FooTer',
    data() {
    return {
      currentYear: new Date().getFullYear(),
    };
  },
  }
  </script>
 