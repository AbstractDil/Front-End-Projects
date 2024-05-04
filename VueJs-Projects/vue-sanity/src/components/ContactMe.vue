<script setup>
import Header from './HeaDer.vue';


</script>

<template>
 <div>
    <!-- Jubmtron Header Starts -->
    <Header title="Contact Me"/>
    <!-- Jubmtron Header Ends -->

    <section class="py-3 py-md-5 py-xl-8">
      <div class="container">
         <div class="row">
            <div class="col-md-6  offset-md-3">
               <form action="" class="p-4 p-md-5 border rounded-3 bg-body-tertiary" id="contactForm" >
        <div class="form-floating mb-3">
          <input type="text" class="form-control" id="firstname" name="firstname" placeholder="John Due"><label for="firstname">Firstname</label>
        </div>
        <div class="form-floating mb-3">
          <input type="text" class="form-control" id="lastname" name="lastname" placeholder="John Due"><label for="lastname">Lastname</label>
        </div>
        <div class="form-floating mb-3">
          <input type="email" class="form-control" id="email" name="email" placeholder="name@example.com"><label for="email">Email address</label>
        </div>
        <div class="form-floating mb-3">
          <input type="text" class="form-control" id="subject" name="subject" placeholder="subject"><label for="subject">Subject</label>
        </div>
        <div class="form-floating mb-3">
          <textarea style="height: 120px" class="form-control" placeholder="Leave a comment here" id="msg" name="message"></textarea><label for="msg">
            Type your message
          </label>
        </div>

        <button class="w-100 btn btn-lg btn-info" id="submitBtn" type="button" v-on:click="showMsg">
        <i class="bi bi-check"></i> Submit</button>
        <hr class="my-4">
        <small class="text-body-secondary"><div class="alert alert-warning d-flex align-items-center" role="alert">
            <div>
              <i class="bi bi-info-circle-fill mx-2"></i>
               <b>Please Note : </b>
               All fields are required to submit the form.
            </div>
          </div></small>
      
      </form>
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

function showMsg(){
   alert('Alert!! Form is not working now !');
}
</script>

<style lang="scss" scoped></style>