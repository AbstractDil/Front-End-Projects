<script setup>
import ProfileInfo from "@/components/ProfileInfo.vue";
import ProfileUpdatePassword from "@/components/ProfileUpdatePassword.vue";
import { getCurrentInstance } from "vue";
import { useStore } from "vuex"; // Import useStore for Vuex
import axios from "axios";
import { useRouter } from "vue-router"; // Import useRouter
import { ref } from "vue";

const { proxy } = getCurrentInstance();
const store = useStore(); // Access Vuex store
const loading = ref(false);
const router = useRouter();

const confirmDelete = () => {
  proxy.$swal
    .fire({
      title: "Are you sure?",
      text: "You want to delete your account!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    })
    .then((result) => {
      if (result.isConfirmed) {
        // Call the function to delete the account
        deleteAccount();
      }
    });
};

const deleteAccount = async () => {
  loading.value = true;

  // Get token and userId from Vuex store
  const token = store.state.auth?.token; // Access auth module's token
  const userId = store.state.auth?.userId; // Access auth module's userId

  try {
    const response = await axios.delete(`delete-user/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Logout and redirect to login
    store.dispatch("auth/logout").then(() => {
      router.push("/"); // Redirect to login page
    });
    console.log("API response:", response.data);

    proxy.$swal.fire("Deleted!", "Your account has been deleted.", "success");
  } catch (error) {
    if (error.response) {
      const statusCode = error.response.status;
      const errorMessages =
        Object.values(error.response.data.messages).join(" ") ||
        "An unexpected error occurred.";
      proxy.$swal.fire(`Error ${statusCode}!`, errorMessages, "error");
    } else {
      proxy.$swal.fire(
        "Connection Error!",
        "Backend server is not responding. Please try again later.",
        "error"
      );
    }
  } finally {
    loading.value = false;
  }
};
</script>
<template>
  <section class="bg-body-tertiary py-4">
    <ProfileInfo />

    <ProfileUpdatePassword />

    <!-- Delete Account Section Starts -->
    <div class="delete-account container py-4">
      <div class="card p-3">
        <div class="card-body text-start">
          <h5 class="card-title text-start fw-bold text-success mx-2">
            <i class="bi bi-person-x-fill"></i> Delete Account
          </h5>
          <div class="container">
            <div class="row">
              <div class="col-md-6">
                <p class="font-sm text-muted">
                  Once your account is deleted, all of your resources and data
                  will be permanently deleted. Before deleting your account,
                  please download any data or information that you wish to
                  retain.
                </p>
                <div class="text-start">
                  <button
                    class="btn btn-danger"
                    type="submit"
                    @click="confirmDelete"
                    :disabled="loading"
                  >
                    <template v-if="loading">
                      <div
                        class="spinner-border text-light spinner-border-sm"
                        role="status"
                      >
                        <span class="visually-hidden">Loading...</span>
                      </div>
                      Processing...
                    </template>
                    <template v-else>
                    <i class="bi bi-trash"></i> Delete Account
                  </template>

                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Delete Account Section Ends -->
  </section>
</template>



<script>
export default {
  name: "AccountProfile",
  components: {
    ProfileInfo,
    ProfileUpdatePassword,
  },
};
</script>


