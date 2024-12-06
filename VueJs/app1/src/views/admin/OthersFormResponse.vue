<template>
  <section class="bg-body-tertiary py-4">
    <!-- Sender photo and name -->
    <div class="container" v-if="userDetails.name">
      <div class="card mb-5 border-success">
        <div class="card-header bg-success text-white text-start">
          <i class="bi bi-info-circle-fill"></i> Profile Information
        </div>
        <div class="card-body d-flex justify-content-start align-items-center">
          <img v-if="userDetails.profile_photo_path" :src="userDetails.profile_photo_path" alt="UserProfilePic"
            class="img-thumbnail profile-image rounded-circle mx-3">
          <h5 class="text-start">{{ userDetails.name }}, Your form responses are given below:</h5>
        </div>
        <div class="card-footer">
          <p class="text-end text-muted pb-0 mb-0"> <i class="bi bi-graph-up-arrow"></i>
            Form Hits Count:

            <template v-if="loading">
              <p class="card-text placeholder-glow">
                <span class="placeholder col-1"></span>
              </p>
            </template>

            <template v-else> {{ totalHits }}</template>
          </p>
        </div>
      </div>
    </div>

    <!-- Form Responses -->
    <div class="container text-start">
      <div class="card my-5 border-success">
        <div class="card-header bg-success text-white text-start d-flex justify-content-between align-items-center">
          <div>
            <i class="bi bi-patch-question-fill"></i> Form Responses
          </div>
          <div v-if="pagination.total">
            Total Responses: <span class="badge bg-light text-success">{{ pagination.total }}</span>
          </div>
        </div>
        <div class="card-body">
          <template v-if="loading">
            <p class="card-text placeholder-glow">
              <span class="placeholder col-8"></span>
              <span class="placeholder col-8"></span>
              <span class="placeholder col-8"></span>
            </p>
          </template>

          <template v-else>
            <ol v-if="questions.length && formResponses.length">
              <li v-for="(question, index) in questions" :key="index">
                <strong>{{ question.description }}</strong>:
                <span class="text-success">
                  {{ formResponses[0]?.[`ques_${index + 1}`] || "No Response" }}
                </span>
              </li>
              <li>
                <strong>Response Time: </strong>
                <span class="text-success">
                  {{ formatDateTime(formResponses[0]?.created_at) || "No Time Provided" }}
                </span>
              </li>

              <li>
                <strong>Responder IP Address: </strong>
                <span class="text-success">
                  {{ formResponses[0]?.ip_address || "No IP address Provided" }}
                </span>
              </li>

              <li class="mt-3">
                <strong>Actions : </strong>
                <!-- Correct syntax for router-link -->
                <router-link :to="`/admin/edit-form-response?formId=${formResponses[0]?.ref_form_id}&resId=${formResponses[0]?.form_id}&userId=${urlUserId}`"
                  class="btn btn-warning btn-sm me-2">
                  <i class="bi bi-pencil-fill"></i> Edit
                </router-link>

                <!-- Delete Button -->
                <button class="btn btn-danger btn-sm" @click="deleteResponse(index, formResponses[0]?.form_id)">
                  <i class="bi bi-trash-fill"></i> Delete
                </button>
              </li>



            </ol>
            <p v-else class="text-muted">No form responses or questions found.</p>
          </template>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div class="container">
      <nav v-if="pagination.pageCount > 1" class="py-3">
        <ul class="pagination justify-content-center">
          <li class="page-item" :class="{ disabled: pagination.currentPage === 1 }">
            <button class="page-link" @click="changePage(1)" :disabled="pagination.currentPage === 1">First</button>
          </li>
          <li class="page-item" :class="{ disabled: pagination.currentPage === 1 }">
            <button class="page-link" @click="changePage(pagination.currentPage - 1)"
              :disabled="pagination.currentPage === 1">
              <i class="bi bi-chevron-double-left"></i>
            </button>
          </li>
          <li v-for="page in pageNumbers" :key="page" class="page-item"
            :class="{ active: page === pagination.currentPage }">
            <button class="page-link" @click="changePage(page)">{{ page }}</button>
          </li>
          <li class="page-item" :class="{ disabled: pagination.currentPage === pagination.pageCount }">
            <button class="page-link" @click="changePage(pagination.currentPage + 1)"
              :disabled="pagination.currentPage === pagination.pageCount">
              <i class="bi bi-chevron-double-right"></i>
            </button>
          </li>
          <li class="page-item" :class="{ disabled: pagination.currentPage === pagination.pageCount }">
            <button class="page-link" @click="changePage(pagination.pageCount)"
              :disabled="pagination.currentPage === pagination.pageCount">Last</button>
          </li>
        </ul>
      </nav>
    </div>

    <div class="container">
      <div class="card my-4 border-success">
        <div class="card-header bg-success text-white text-start">
          <i class="bi bi-chat-quote-fill"></i> Quotes
        </div>
        <div class="card-body">
          <blockquote class="blockquote mb-0 p-4">
            <p class="text-success">Zindegi Ka Safar Bade Suhana Hain, Akele Aye The, Akele Chala Jana Hain, Kya Karna
              Hain
              Iss Duniya Mein Risto Ko Banakar..., Ak Na Akdin Chale He Jana Hain...</p>
            <footer class="blockquote-footer">#Collected</footer>
          </blockquote>
        </div>
      </div>
      <!-- Quotes Ends Here -->
    </div>

  </section>
</template>


<script>
import axios from "axios";
import { mapGetters } from "vuex";
import Swal from 'sweetalert2';


export default {
  name: "OthersFormResponse",
  data() {
    return {
      loading: false,
      totalHits: 0,
      userDetails: {}, // Fixed initialization
      urlUserId: null,
      formResponses: [],
      questions: [],
      pagination: {
        currentPage: 1,
        pageCount: 1,
        total: 0,
      },
    };
  },
  computed: {
    ...mapGetters("auth", {
      admId: "userDetails",
      token: "token",
    }),
    pageNumbers() {
      const maxVisiblePages = 3;
      const { currentPage, pageCount } = this.pagination;

      if (pageCount <= maxVisiblePages) {
        return Array.from({ length: pageCount }, (_, i) => i + 1);
      }

      const half = Math.floor(maxVisiblePages / 2);
      let start = Math.max(currentPage - half, 1);
      let end = Math.min(start + maxVisiblePages - 1, pageCount);

      if (end - start + 1 < maxVisiblePages) {
        start = Math.max(end - maxVisiblePages + 1, 1);
      }

      return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    },
  },
  methods: {
    async fetchUserData() {
      this.loading = true;
      try {
        const userId = new URL(window.location.href).searchParams.get("userId");
        if (userId && this.admId) {
          const response = await axios.post(
            `/admin/update-user-details?admId=${this.admId.uid}&req_type=7&uid=${userId}`,
            {},
            { headers: { Authorization: `Bearer ${this.token}` } }
          );
          this.userDetails = response.data.data || {};
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        this.loading = false;
      }
    },
    async fetchFormResponses(page = 1) {
      this.loading = true;
      const formId = new URL(window.location.href).searchParams.get("formId");
      const userId = new URL(window.location.href).searchParams.get("userId");

      try {
        const response = await axios.post(
          `admin/form-actions?admId=${this.admId.uid}&req_type=1&formId=${formId}&userId=${userId}&page=${page}&limit=1&order=DESC`,
          {},
          { headers: { Authorization: `Bearer ${this.token}` } }
        );
        if (response.data.status === 200) {
          this.formResponses = response.data.data || [];
          const { currentPage, pageCount, total } = response.data.pagination || {};
          this.pagination = { currentPage, pageCount, total };
        }
      } catch (error) {
        console.error("Error fetching form responses:", error);
      } finally {
        this.loading = false;
      }
    },

    // Delete the selected response
    async deleteResponse(index, resId) {
      // Ensure SweetAlert2 is imported correctly
      try {
        // Show confirmation dialog
        const confirmDelete = await Swal.fire({
          title: 'Are you sure?',
          text: 'You won’t be able to revert this action!',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#d33',
          cancelButtonColor: '#3085d6',
          confirmButtonText: 'Yes, delete it!',
        });

        if (confirmDelete.isConfirmed) {
          // Call API to delete the response
          const responseId = resId; // Assuming form_id is the identifier
          const formId = new URL(window.location.href).searchParams.get("formId");
          const userId = new URL(window.location.href).searchParams.get("userId");
          const result = await axios.post(`admin/form-actions?admId=${this.admId.uid}&formId=${formId}&req_type=4&responseId=${responseId}&userId=${userId}`, {
            headers: { Authorization: `Bearer ${this.token}` },
          });

          if (result.data.status === 200) {
            // Show success alert
            await Swal.fire({
              title: 'Deleted!',
              text: 'The response has been deleted.',
              icon: 'success',
              timer: 1500,
              showCancelButton: true,
          cancelButtonColor: '#3085d6',
              showConfirmButton: false,
            });

            // Refresh the form responses
            this.fetchFormResponses(this.pagination.currentPage);
          } else {
            // Show error alert
            await Swal.fire({
              title: 'Error!',
              text: result.data.message || 'Failed to delete the response.',
              icon: 'error',
              timer: 1500,
              showCancelButton: true,
          cancelButtonColor: '#3085d6',
              showConfirmButton: false,
            });
          }
        }
      } catch (error) {
        console.error('Error during delete operation:', error);

        // Show error alert
        await Swal.fire({
          title: 'Error!',
          text: error.message || 'An error occurred while deleting the response.',
          icon: 'error',
          timer: 1500,
          showConfirmButton: false,
          showCancelButton: true,
          cancelButtonColor: '#3085d6',
        });
      }
    },


    async fetchQuestions() {
      try {
        const response = await axios.get("friendship-questions-2024", {
          headers: { Authorization: `Bearer ${this.token}` },
        });
        if (response.data.status === 200) {
          this.questions = response.data.data || [];
        }
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    },
    async getTotalHits() {
      this.loading = true;
      const formId = new URL(window.location.href).searchParams.get("formId");
      try {
        const response = await axios.get(`/form-hit-count/${formId}`);
        if (response.data.status === 200) {
          this.totalHits = response.data.total_hits;
        }
      } catch (error) {
        console.error("Error fetching total hits:", error);
      } finally {
        this.loading = false;
      }
    },
    changePage(page) {
      if (page < 1 || page > this.pagination.pageCount) return;
      this.fetchFormResponses(page);
    },
    formatDateTime(dateString) {
      if (!dateString) return null;
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      }).format(date);
    },
  },
  async mounted() {
    this.loading = true;
     // Extract userId from the URL on component mount
     const params = new URL(window.location.href).searchParams;
     this.urlUserId = params.get("userId");
    try {
      await this.fetchQuestions();
      await this.fetchUserData();
      await this.fetchFormResponses();
      await this.getTotalHits();
    } catch (error) {
      console.error("Initialization error:", error);
    } finally {
      this.loading = false;
    }
  },
};
</script>

<style scoped>
.profile-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 50%;
  border: 2px solid #28a745;
}

.user-details p {
  font-size: 1rem;
  margin-bottom: 0.5rem;
}
</style>
