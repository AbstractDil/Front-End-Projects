<template>
    <div class="container py-5">
        <div class="row">
            <div class="col-md-6 offset-md-3">

                <div class="alert alert-danger" role="alert">

                     <p class="fs-1 text-center border-bottom py-5" >

                         <i class="bi bi-exclamation-triangle-fill blink"></i>
                     </p>
                    <p class="text-center fs-2">
                        Error Code : 404 
                        <br>
                        Page Is Not Found
                    </p>

                    <p class="text-center border-top pt-3">
                        The page you are looking for is not found on the server.
                    </p>

                    <div class="text-center py-5">

                        <button class="btn btn-danger btn-lg  text-center"> Go To Home</button>
                    </div>

                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        components : 'PageNotFound'
    }
</script>

<style lang="scss" scoped>

</style>