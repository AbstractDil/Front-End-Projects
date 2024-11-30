<template>
  <section class="bg-body-tertiary py-4">
    <!-- Sender photo and name -->
    <div class="container" v-if="userDetails">
      <div class="card mb-5 border-success">
        <div class="card-header bg-success text-white text-start">
          <i class="bi bi-info-circle-fill"></i> Profile Information
        </div>
        <div class="card-body d-flex justify-content-start align-items-center">
          <img v-if="userDetails.profile_photo_path" :src="userDetails.profile_photo_path" alt="UserProfilePic"
            class="img-thumbnail profile-image rounded-circle mx-3">
          <h5>{{ userDetails.name }}, Your form responses are given below:</h5>
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
          <div v-if="pagination">
            Total Responses: <span class="badge bg-light text-success">{{ pagination.total }}</span>
          </div>
        </div>
        <div class="card-body">

          <ol v-if="questions.length && formResponses.length">
            <li v-for="(question, index) in questions" :key="index">
              <strong>{{ question.description }}</strong>:
              <span class="text-success">{{ formResponses[0][`ques_${index + 1}`] || "No Response" }}</span>
            </li>
          </ol>
          <div v-else>
            <p class="text-muted">No form responses or questions found.</p>
          </div>
        </div>
      </div>
    </div>

   <div class="container">
       <!-- Pagination Starts -->

        
       <nav v-if="pagination.pageCount > 1" class="py-3" >
            <ul class="pagination justify-content-center">
              <!-- First Button -->
              <li class="page-item" :class="{ disabled: pagination.currentPage === 1 }">
                <button class="page-link" @click="changePage(1)" :disabled="pagination.currentPage === 1">
                  First
                </button>
              </li>

              <!-- Previous Button -->
              <li class="page-item" :class="{ disabled: pagination.currentPage === 1 }">
                <button class="page-link" @click="changePage(pagination.currentPage - 1)"
                  :disabled="pagination.currentPage === 1">
                  <i class="bi bi-chevron-double-left"></i>
                </button>
              </li>

              <!-- Page Numbers -->
              <li v-for="page in pageNumbers" :key="page" class="page-item"
                :class="{ active: page === pagination.currentPage }">
                <button class="page-link" @click="changePage(page)">
                  {{ page }}
                </button>
              </li>

              <!-- Next Button -->
              <li class="page-item" :class="{ disabled: pagination.currentPage === pagination.pageCount }">
                <button class="page-link" @click="changePage(pagination.currentPage + 1)"
                  :disabled="pagination.currentPage === pagination.pageCount">
                  <i class="bi bi-chevron-double-right"></i>
                </button>
              </li>

              <!-- Last Button -->
              <li class="page-item" :class="{ disabled: pagination.currentPage === pagination.pageCount }">
                <button class="page-link" @click="changePage(pagination.pageCount)"
                  :disabled="pagination.currentPage === pagination.pageCount">
                  Last
                </button>
              </li>
            </ul>
        </nav>

          <!-- Pagination Ends -->
   </div>


    <!-- Quotes Starts Here -->
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

export default {
  name: "FormResponses",
  data() {
    return {
      loading: false,
      formResponses: [],
      pagination: {
        currentPage: 1, // Initialize to page 1
        pageCount: 1, // Initialize total pages as 1
        total: 0, // Total form responses
      },
      questions: [], // To store questions fetched from the API
    };
  },
  computed: {
    ...mapGetters("auth", {
      userDetails: "userDetails",
      token: "token", // Assumes Vuex has a getter for token
    }),
    // Dynamically generate a list of page numbers for pagination
    pageNumbers() {
      const maxVisiblePages = 3; // Number of visible page links
      const { currentPage, pageCount } = this.pagination;

      if (pageCount <= maxVisiblePages) {
        return Array.from({ length: pageCount }, (_, i) => i + 1); // Show all pages
      }

      const half = Math.floor(maxVisiblePages / 2);
      let start = Math.max(currentPage - half, 1);
      let end = Math.min(start + maxVisiblePages - 1, pageCount);

      // Adjust start if near the end
      if (end - start + 1 < maxVisiblePages) {
        start = Math.max(end - maxVisiblePages + 1, 1);
      }

      return Array.from({ length: end - start + 1 }, (_, i) => start + i);


    },
  },
  methods: {
    // Fetch form responses
    async fetchFormResponses(page = 1) {
      if (!this.userDetails?.uid || !this.token) {
        console.error("Missing user details or token.");
        return;
      }

      this.loading = true;

      try {
        // Construct the URL with query parameters
        const requestUrl = `all-form-responses?userId=${this.userDetails.uid}&formId=${this.userDetails.form_id}&page=${page}&limit=1&order=DESC`;

        const response = await axios.post(requestUrl, {}, {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        });

        if (response.data.status === "success") {
          this.formResponses = response.data.data || [];
          const { currentPage, pageCount, total } = response.data.pagination || {};
          this.pagination = {
            currentPage: currentPage || 1,
            pageCount: pageCount || 1,
            total: total || 0,
          };
        } else {
          console.error("Failed to fetch form responses:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching form responses:", error);
      } finally {
        this.loading = false;
      }
    },

    // Handles changing the page
    changePage(page) {
      if (page < 1 || page > this.pagination.pageCount) return;
      this.fetchFormResponses(page);
    },

    // Fetch questions
    async fetchQuestions() {
      try {
        const response = await axios.get("friendship-questions-2024", {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        });

        if (response.data.status === 200) {
          this.questions = response.data.data || [];
        } else {
          console.error("Failed to fetch questions:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    },
  },
  async mounted() {
    await this.fetchQuestions();
    this.fetchFormResponses();
  },
};
</script>



<style scoped>
.profile-image {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 50%;
  border: 2px solid #28a745;
}

.custom-input:focus {
  border-color: #42b983;
  box-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.25);
}
</style>
