<script setup> 
defineProps({
  subtitle: {
    type: String,
    required: true
  }
})
</script>

<template>
    <div class="container my-5">
        <div class="row">
            <div class="col-md-6 offset-md-3 ">
                <div class="d-flex justify-content-center align-items-center">
                    <!--  Card Starts  -->
                    <div class="card p-3" style="width:24em;">
                    <div class="card-body">
                        <h5 class="card-title text-center mb-4">{{subtitle}}</h5>
                        <form>
                            <div class="mb-3">
                                <label for="email" class="form-label">Email address</label>
                                <input type="email" class="form-control" id="email" aria-describedby="emailHelp">
                                <div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div>
                            </div>
                            <div class="mb-3">
                                <label for="pwd" class="form-label">Password</label>
                                <input type="password" class="form-control" id="pwd">
                            </div>
                           
                            <div class="d-grid gap-2 col-12 mx-auto">
                            <button class="btn btn-primary" type="button">Login</button>
                            <!-- <button class="btn btn-primary" type="button">Button</button> -->
                            </div>
                            </form>
                    </div>
                    </div>
                    <!-- Card Ends ------->

                </div>
            </div>
        </div>

    </div>
</template>

<script>
    export default {
        name : "LoginForm",
    }
</script>

