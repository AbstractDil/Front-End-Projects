<script setup>
defineProps({
  appName: {
    type: String,
    required: true
  }
})
</script>

<template>
  <!-- Hero Section Starts -->
   <div class="hero-bg">
    <div class="overlay">
      <div class="container col-xxl-8 px-4 py-5">
      <div class="row flex-lg-row-reverse align-items-center g-5 py-5">
        <div class=" col-sm-12 col-lg-6 text-center">
          <img src="https://abstractdil.github.io/Front-End-Projects/Portfolio/Sagar/Nov2023/assets/img/avatarSagar.jpg" class="d-block mx-auto img-fluid rounded-circle hero-img" alt=""  loading="lazy">
        </div>
        <div class="col-lg-6 for-mob-text-center">
          <p class="lead text-light">Hi, I'm</p>
          <h1 class="display-5 fw-bold  lh-1 mb-5 text-info">
            <span class="typed-text">{{ typeValue }}</span>
            <span class="cursor" :class="{'typing': typeStatus}">&nbsp;</span>
          </h1>
          <div class="d-grid gap-2 d-md-flex justify-content-md-start">
            <button type="button" class="btn btn-info btn-lg px-4 me-md-2">
              <i class="bi bi-person-check"></i>  About Me
            </button>
            <button type="button" class="btn  btn-lg px-4 btn-outline-light"
            >
            <i class="bi bi-emoji-heart-eyes"></i> Hire Me
          </button>
          </div>
        </div>
      </div>
    </div>

    </div>
  <!-- Hero Section Ends -->
</div>

</template>

<script>
//import { setTimeout } from 'timers';
export default {
    data: () => {
      return {
        typeValue: '',
        typeStatus: false,
        typeArray: ['Sagar Nandy','CodeIgniter Developer','Vue JS Developer','Laravel Developer', ' Express JS Developer','A Full Stack Web Developer'],
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
  background-image:  url("../assets/images/hero-bg.jpeg");
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
  background :rgba(1, 24, 24, 0.8);

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