<script setup>
defineProps({
  appName: {
    type: String,
    required: true
  }
});

</script>

<template>
  <!-- Hero Section Starts  -->
  <section class="hero-bg">
    <div class="overlay">
    <div class="container col-md-9 px-4 py-5">
        <div class="row flex-lg-row-reverse align-cards-center g-5 py-5">
          <div class="col-md-6 mb-4 text-center">
            <img src="@/assets/img/TriparnaAbout.jpg" class="hero-img mx-lg-auto img-thumbnail rounded-circle" alt="HeroImage" width="320"  loading="lazy">
          </div>
          <div class="col-md-6 for-mob-text-center text-light pt-4">
              <p class="mx-1 lead mb-3">Hello, I'm</p>
              <h1 class="display-5 fw-bold lh-1 mb-5 text-info">
            <span class="typed-text">{{ typeValue }}</span>
            <span class="cursor" :class="{'typing': typeStatus}">&nbsp;</span>
          </h1>

            <!-- About and Contacr Button Starts -->

            <div class="d-grid gap-2 d-md-flex justify-content-md-start mt-2">
            <RouterLink to="/about" class="btn btn-info btn-lg px-4 me-md-2">
              <i class="bi bi-person-check"></i>  About Me
          </RouterLink>
          <RouterLink to="/contact" class="btn btn-outline-light btn-lg px-4 me-md-2">
            <i class="bi bi-emoji-heart-eyes"></i> Contact
        </RouterLink>

          </div>

            <!-- About and Contacr Button Ends -->


            <!-- Social Media Icons Starts -->

            <div class="d-grid gap-2 d-flex justify-content-md-start mt-4">
              <button type="button" class="btn btn-primary btn-lg rounded-circle mx-1">
                <i class="fa fa-facebook-official"></i>  
              </button>

              <button type="button" class="btn btn-success btn-lg rounded-circle mx-1">
                <i class="fa fa-whatsapp"></i>  
              </button>


              <button type="button" class="btn btn-danger btn-lg rounded-circle mx-1">
                <i class="fa fa-google"></i>  
              </button>

              <button type="button" class="btn btn-primary btn-lg rounded-circle mx-1">
                <i class="fa fa-linkedin"></i>  
              </button>

              <button type="button" class="btn btn-light btn-lg rounded-circle">
                <i class="fa fa-github"></i>  
              </button>

            </div>

            <!-- Social Media Icons Ends -->


          </div>
        </div>
    </div>
  </div>
    </section>
    <!-- Hero Section Ends -->

    
</template>

<script>
//import { setTimeout } from 'timers';
export default {
  components : "HeroSection",
    data: () => {
      return {
        typeValue: '',
        typeStatus: false,
        typeArray: ['Triparna Sarkar','A Content Writer','A Guitarist','A Trader'],
        typingSpeed: 100,
        erasingSpeed: 70,
        newTextDelay: 1000,
        typeArrayIndex: 0,
        charIndex: 0
      }
    },
    methods: {
      typeText() {
        if(this.charIndex < this.typeArray[this.typeArrayIndex].length) {
          if(!this.typeStatus)
            this.typeStatus = true;

          this.typeValue += this.typeArray[this.typeArrayIndex].charAt(this.charIndex);
          this.charIndex += 1;

          setTimeout(this.typeText, this.typingSpeed);
        }
        else {
          this.typeStatus = false;
          setTimeout(this.eraseText, this.newTextDelay);
        }
      },
      eraseText() {
        if(this.charIndex > 0) {
          if(!this.typeStatus)
            this.typeStatus = true;

          this.typeValue = this.typeArray[this.typeArrayIndex].substring(0, this.charIndex - 1);
          this.charIndex -= 1;
          setTimeout(this.eraseText, this.erasingSpeed);
        }
        else {
          this.typeStatus = false;
          this.typeArrayIndex += 1;
          if(this.typeArrayIndex >= this.typeArray.length)
            this.typeArrayIndex = 0;

          setTimeout(this.typeText, this.typingSpeed + 1000);
        }
      }
    },
    created() {
      setTimeout(this.typeText, this.newTextDelay + 200);
    }
  }

</script>

<style scoped>

.hero-img{
  
  /* background-color: blue; */
  border:20px solid rgba(var(--bs-info-rgb));
  width:300px;
  box-shadow: 0 0 40px rgba(var(--bs-info-rgb));
  animation: shadow 0.5s ease-in-out infinite alternate;
    
    }
 @keyframes shadow{
        0%{
          box-shadow: 0 0 20px rgba(var(--bs-info-rgb));
        }
        100%{
          box-shadow: 0 0 40px rgba(var(--bs-info-rgb));
        }
      }

      span.cursor {
      display: inline-block;
      margin-left: 3px;
      width: 4px;
      background-color: #fff;
      animation: cursorBlink 1s infinite;
    }

    span.cursor.typing {
      animation: none;
    }
  

  @keyframes cursorBlink {
    49% { background-color: #fff; }
    50% { background-color: transparent; }
    99% { background-color: transparent; }
  }
  .hero-bg{
  height: 100%;
  background-image:  url("../assets/img/HeroImage.jpg");
  background-size: cover;
  background-position: center;
  display: flex;
  justify-content: center;
  align-items: center;
  }
  .hero-bg .overlay{
  width:100%;
  height: 100%;
  margin: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  /* background-color:#0c5f80; */
  background :rgba(1, 9, 24, 0.8);

}

.typed-text{
  font-family: "Salsa", cursive;
}

@media only screen and (max-width: 600px){
  .for-mob-text-center {
      text-align: center;
  }
  .hero-image {
    width:260px !important;
}


}
</style>

