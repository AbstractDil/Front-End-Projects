<template>
  <div id="carouselBanner" class="carousel slide">
          <div class="carousel-inner">
            <div class="carousel-item active">
              <img src="/Images/banner.png" class="d-block w-100 img-thumbnail" alt="...">
            </div>
            <!-- Add more slides here if needed -->
          </div>
          <button class="carousel-control-prev" type="button" data-bs-target="#carouselBanner" data-bs-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Previous</span>
          </button>
          <button class="carousel-control-next" type="button" data-bs-target="#carouselBanner" data-bs-slide="next">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Next</span>
          </button>
        </div>
</template>

<script>
export default {
name: 'CarouselBanner',
}
</script>

