<template>
    <div class="container col-xl-10 col-xxl-8 px-4 py-5">
        <div class="row align-items-center g-lg-5 ">
            <div class="col-lg-7 text-center text-lg-start">
                <img src="../assets/img/HeroPhoto.jpg" class="d-block mx-lg-auto img-thumbnail shadow" alt="AboutImage" width="360" height="500"  loading="lazy">

            </div>
            <div class="col-md-10 mx-auto col-lg-5 py-5">
                <form class="p-4 p-md-5 border rounded-3 bg-body-tertiary">
                    <div class="form-floating mb-3">
                        <input type="text" class="form-control" id="floatingInput" placeholder="John Due">
                        <label for="floatingInput">Fullname</label>
                    </div>
                    <div class="form-floating mb-3">
                        <input type="email" class="form-control" id="floatingInput" placeholder="name@example.com">
                        <label for="floatingInput">Email address</label>
                    </div>
                    <div class="form-floating mb-3">
                        <textarea class="form-control" placeholder="Leave a comment here" id="floatingTextarea"></textarea>
                        <label for="floatingTextarea">Comments</label>
                    </div>

                    <button class="w-100 btn btn-lg btn-info" type="submit">Submit</button>
                    <hr class="my-4">
                    <small class="text-body-secondary">

                        <div class="alert alert-warning d-flex align-items-center" role="alert">

                            <div>
                                <i class="bi bi-info-circle-fill"></i>   This form is not working right now.
                            </div>
                        </div>
                    </small>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    components: "ContactMe"
}
</script>

<style  scoped>
.contact-img {
    object-fit: contain;
}
</style>