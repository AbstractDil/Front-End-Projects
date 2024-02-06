<template>
   <div class="container px-4 py-5" id="custom-cards">
    <h2 class="pb-2 border-bottom">
        <i class="bi bi-chat-left-quote-fill"></i>   My Works
    </h2>

    <div class="row row-cols-1 row-cols-lg-3 align-items-stretch g-4 py-5">
      <div class="col" v-for="work in works" :key="work.id">
        <div class="card card-cover overflow-hidden text-bg-dark rounded-4 shadow-lg">
            <img v-bind:src="work.workUrl" class="img-fluid" alt="">
        </div>
      </div>

     
    </div>
  </div>
</template>

<script>
    export default {
        components : "MyWords",
        data(){
              return{
                works : [
                  { id : 1,  workUrl: '../../public/twork/twork-1.jpeg'},
                  {id :2 ,  workUrl: '../../public/twork/twork-2.jpg'},
                  {id : 3 ,  workUrl: '../../public/twork/twork-3.jpg'},
                 

                ],
              // isDark : false
              }
      },
    }
</script>

<style lang="scss" scoped>

</style>