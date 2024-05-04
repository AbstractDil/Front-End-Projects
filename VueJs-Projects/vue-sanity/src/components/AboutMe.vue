<script setup>
import Header from './HeaDer.vue';

</script>

<template>
 <div>
    <!-- Jubmtron Header Starts -->
    <Header title="About Me"/>
    <!-- Jubmtron Header Ends -->

    <!-- About 1 - Bootstrap Brain Component -->
<section class="py-3 py-md-5 py-xl-8">
  <div class="container col-md-10 px-4 py-5">
    <div class="row py-5">
      <div class="col-lg-6 col-12 mb-3">
        <img  src="https://abstractdil.github.io/Front-End-Projects/Portfolio/Sagar/Nov2023/assets/img/avatarSagar.jpg" class="d-block mx-lg-auto img-thumbnail shadow" alt="AboutImage" width="350" loading="lazy">
      </div>
      <div class="col-lg-6 col-12">
        <h1 class="display-5 fw-bold mb-4 pt-2 text-info "> SAGAR NANDY</h1>
        <p class="mx-1 lead">
          I'm Sagar Nandy. I'm Graduated In Mathematics Honours From Santipur College Under University Of Kalyani. Now I Am Learning Web Development As My Interest i.e PHP &amp; Node Js. Also I'm Preparing For SSC CGL and CHSl Examinations. I Wanted To Be A Full Stack Web Developer In Future.
        </p>
        <a type="button" class="btn btn-info btn-lg rounded-pill px-4 mt-3"><i class="bi bi-download"></i> Download CV
        </a>
      </div>
    </div>
  </div>
</section>

 </div>
</template>

<script>
export default {
 components: "HeaderComponent"
}
</script>

<style lang="scss" scoped></style>