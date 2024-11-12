<template>

<!-- Services Section Starts Here -->

    <div>

    <div class="container px-4 py-5" id="featured-3">
    <h2 class="pb-2 border-bottom"><i class="bi bi-person-workspace"></i> My Services</h2>
    <div class="row g-4 py-5 row-cols-1 row-cols-lg-3">
      
      <div class="feature col"  v-for="service in services" :key="service.id">
        <div class="feature-icon d-inline-flex align-items-center justify-content-center text-bg-info bg-gradient fs-2 mb-3">
          <i class="bi bi-code-slash"></i>
        </div>
        <h3 class="fs-2 text-body-emphasis">{{ service.service }}</h3>
        <p>{{service.desc}}</p>
        <a href="" class="icon-link">
          Book a Demo
          <svg class="bi"><use xlink:href="#chevron-right"></use></svg>
        </a>
      </div>
     
    </div>
  </div>

    </div>
<!-- Services Section Ends Here -->

</template>

<script>
    export default {
        components: "SerVices",
        data(){
          return{
            services : [
              { id : 1,  service: 'FrontEnd Web Development', desc : 'using VueJs, Bootstrap and TailwindCSS'},
              {id :2 ,  service: 'BackEnd Web Development',desc : 'using ExpressJs, CodeIgniter and Laravel'},
              {id : 3 ,  service: 'Full Stack  Development', desc : 'using VueJs, Bootstrap, TailwindCSS, ExpressJs, CodeIgniter and Laravel'},
            ],
          // isDark : false
          }
  },
    }
</script>

<style  scoped>

.feature-icon {
    width: 4rem;
    height: 4rem;
    border-radius: 0.75rem;
}

</style>