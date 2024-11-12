<template>
<!--  Carousel Starts   -->
<div class="">
  <div id="carouselExample" class="carousel slide border border-2">
  <div class="carousel-inner">
    <div class="carousel-item active">
      <img src="@/assets/Images/banner/hero-img-mhbc.webp" class="d-block w-100" alt="...">
    </div>
     
    <div class="carousel-item">
      <img src="@/assets/Images/banner/hero-img-mhbc.webp" class="d-block w-100" alt="...">
    </div> 
  </div>
  <button class="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
    <span class="visually-hidden">Previous</span>
  </button>
  <button class="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
    <span class="carousel-control-next-icon" aria-hidden="true"></span>
    <span class="visually-hidden">Next</span>
  </button>
</div>
</div>
</template>

<script>
    export default {
      name : "CarouselBanner",
    }
</script>

<style lang="scss" scoped>

</style>
