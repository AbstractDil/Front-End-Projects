<template>
  <footer class="bg-secondary-dark text-white">
      <div class="container px-4 pt-5">
        <div class="row">
          <div 
      v-for="(section, index) in sections" 
      :key="index" 
      class="col-6 col-md-2 mb-4"
    >
      <h6 class="text-uppercase"><i class="bi bi-link-45deg"></i> {{ section.name }}</h6>
      <ul class="nav flex-column">
        <li 
          v-for="(link, linkIndex) in section.links" 
          :key="linkIndex" 
          class="nav-item mb-2"
        >
        
          <a
            v-bind:href="link.url" 
            class="nav-link p-0 text-light"
            target="_blank"
          >
          <i class="bi bi-caret-right-fill"></i> {{ link.label }}
          </a>
        </li>
      </ul>
    </div>
    
  
          <div class="col-md-5 offset-md-1 mb-4">
           
              <h5><i class="bi bi-envelope-at-fill"></i> Technical Support</h5>
              <p>For any query feel free to contact with us!
              <a href="mailto:nandysagar@yahoo.com?subject=For Technical Support (MathHub Combined)&amp;body= **Write your problem description here but Donot change the subject.**" class="text-warning text-decoration-none">nandysagar@yahoo.com
              </a>
             </p>

             <p class="text-info">
              <i class="bi bi-cloud-check-fill"></i> Launched On Nov 03, 2024
             </p>

             <p class="text-light">
              <i class="bi bi-eye"></i> Total Visitors : 
             </p>
           
          </div>
        </div>
    
        <div class="d-flex flex-column  justify-content-center align-items-center py-3 border-top">
          <p class="mb-0">© {{ currentYear }} {{appName}} - All rights reserved.</p>
          <p class="py-0 my-0">Design &amp; Developed by <a class="text-warning text-decoration-none" href="https://nandysagar.in/" target="_blank"> Sagar Nandy </a></p>
        </div>
    </div>
      </footer>
</template>

<script>
export default {
    name: 'AppFooter',
    props: {
    appName: {
      type: String,
      required: true
    }
  },
    data() {
        return {
            currentYear: '',
            sections: [
        {
          name: 'Official Links',
          links: [
            { label: 'SSC New Portal', url: 'https://ssc.gov.in/' },
            { label: 'WBPSC Portal 1', url: 'https://psc.wb.gov.in/' },
            { label: 'WBPSC Portal 2', url: 'https://wbpsc.ucanapply.com/' },
            { label: 'Railway - RRB', url: 'https://rrbapply.gov.in/' },

          ]
        },
        {
          name: 'Free Mocks',
          links: [
            { label: 'iMOES Mock', url: 'https://imoes.nandysagar.in/' },
            { label: 'RBE Mock', url: 'https://rbelearning.com/' },
            { label: 'Parmar SSC Mock', url: 'https://www.parmaracademy.in/'},
            { label: 'Test Ranker Mock', url: 'https://www.testranker.com/' },
            { label: 'Testbook Mock', url: 'https://www.testbook.com/' },
            { label: 'Olive Board Mock', url: 'https://www.oliveboard.in/' },


            

          ]
        },
        {
          name: 'Site Links',
          links: [
          { label: 'Home', url: '/' },
          { label: 'Registration', url: '/registration' },
          { label: 'Login', url: '/login' },
          { label: 'Contact', url: '/contact' },
          { label: 'About', url: '/about' },
          { label: 'Careers', url: '/careers' }
          ]
        }
      ]
        };
    },
    methods: {
        getCurrentYear() {
            const year = new Date().getFullYear();
            console.log(year);
            this.currentYear = year;
        },
    },
    created() {
        this.getCurrentYear(); // Call the method when the component is created
    },
};

</script>

<style>

</style>