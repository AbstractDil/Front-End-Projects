<template>
  <section class="bg-body-tertiary py-4">

    <!-- Sender photo and name shown here starts -->
     <div class="container">
      <div class="card mb-5 border-success">
        <div class="card-header bg-success text-white text-start">
          <i class="bi bi-info-circle-fill"></i> Sender Information
        </div>
        <div class="card-body d-flex justify-content-start align-items-center">
            <img  :src="userdata.profile_photo"  alt="UserProfilePic" class="img-thumbnail profile-image rounded-circle mx-3">
            <h5>{{ userdata.name }} is waiting for your response.</h5>
        </div>
      </div>
     </div>

    <!-- Sender photo and name shown here ends -->

    <!-- Form Starts Here -->
    <div class="container text-start">
      <div class="card my-5 border-success">
        <div class="card-header bg-success text-white text-start">
          <i class="bi bi-patch-question-fill"></i> Questions
        </div>
        <div class="card-body">
          <form class="p-4 rounded" @submit.prevent="submitForm">
            <!-- Display only the current question -->
            <div v-if="currentQuestion">
              <h5>{{ currentQuestion.description }}</h5>

              <!-- Text Input -->
              <div v-if="currentQuestion.type === 'text'">
                <input v-model="answers[currentQuestion.id]" type="text" class="form-control custom-input"
                  @input="validateCharacterLimit(currentQuestion.id, 100)" />
                <small class="text-primary">
                  {{ remainingCharacters(currentQuestion.id, 100) }} characters left
                </small>
                <div v-if="errors[currentQuestion.id]" class="text-danger">
                  {{ errors[currentQuestion.id] }}
                </div>
              </div>

              <!-- Radio Buttons -->
              <div v-if="currentQuestion.type === 'radio'">
                <div class="form-check" v-for="(option, index) in currentQuestion.options"
                  :key="`radio-${currentQuestion.id}-${index}`">
                  <input class="form-check-input custom-input" :id="`radio-${currentQuestion.id}-${index}`"
                    v-model="answers[currentQuestion.id]" :value="option.value" type="radio" />
                  <label class="form-check-label" :for="`radio-${currentQuestion.id}-${index}`">
                    {{ option.label }}
                  </label>
                </div>
                <div v-if="errors[currentQuestion.id]" class="text-danger">
                  {{ errors[currentQuestion.id] }}
                </div>
              </div>

              <!-- Textarea -->
              <div v-if="currentQuestion.type === 'textarea'">
                <textarea v-model="answers[currentQuestion.id]" class="form-control custom-input"
                  @input="validateCharacterLimit(currentQuestion.id, 255)"></textarea>
                <small class="text-muted">
                  {{ remainingCharacters(currentQuestion.id, 255) }} characters left
                </small>
                <div v-if="errors[currentQuestion.id]" class="text-danger">
                  {{ errors[currentQuestion.id] }}
                </div>
              </div>
            </div>

            <!-- Navigation Buttons -->
            <div class="mt-4">
              <button type="button" class="btn btn-secondary me-2" @click="previousQuestion"
                :disabled="currentQuestionIndex === 0">
                <i class="bi bi-chevron-left"></i> Previous
              </button>
              <button type="button" class="btn btn-outline-success me-2" @click="validateAndNext"
                v-if="!isLastQuestion">
                Next ({{ formattedProgress }})
              </button>
              <button type="submit" class="btn btn-success" v-if="isLastQuestion">
                <i class="bi bi-check2"></i> Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    <!-- Form Ends Here -->

  <!-- Quotes Starts Here  -->
  <div class="container">
  <div class="card my-4 border-success">
  <div class="card-header bg-success text-white text-start">
    <i class="bi bi-chat-quote-fill"></i> Quotes
  </div>
  <div class="card-body">
    <blockquote class="blockquote mb-0 p-4">
      <p class="text-success">Zindegi Ka Safar Bade Suhana Hain, Akele Aye The, Akele Chala Jana Hain, Kya Karna Hain Iss Duniya Mein Risto Ko Banakar..., Ak Na Akdin Chale He Jana Hain...</p>
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

export default {
  name: "FriendshipForm",
  data() {
    return {
      questions: [], // Array to hold questions
      currentQuestionIndex: 0, // Track current question index
      answers: {}, // Store answers keyed by question ID
      errors: {}, // To store validation errors
      userdata:{
        name:'',
        profile_photo: ''
      }
    };
  },
  computed: {
    currentQuestion() {
      return this.questions[this.currentQuestionIndex] || null;
    },
    isLastQuestion() {
      return this.currentQuestionIndex === this.questions.length - 1;
    },
    formattedProgress() {
      return (
        String(this.currentQuestionIndex + 1).padStart(2, "0") +
        "/" +
        String(this.questions.length).padStart(2, "0")
      );
    },
  },
  methods: {

    fetchUserData() {
      // Extract the user ID from the URL
      const userId = this.$route.params.token; // Ensure your route is configured with :id
      console.log(userId);
      const url = `get-user-data/${userId}`;
      
      // Fetch user data
      axios
        .get(url)
        .then((response) => {
          if (response.data && response.data.data) {
            this.userdata.name = response.data.data.name;
            this.userdata.profile_photo = response.data.data.profile_photo_path;
          } else {
            console.error("Invalid user data response:", response.data);
          }
        })
        .catch((error) => console.error("Error fetching user data:", error));
    },
    fetchQuestions() {
      axios
        .get("/friendship-questions-2024")
        .then((response) => {
          if (response.data && response.data.data) {
            this.questions = response.data.data;
            this.questions.forEach((question) => {
              this.answers[question.id] = ""; // Initialize answers
              this.errors[question.id] = null; // Initialize errors
            });
          } else {
            console.error("Invalid API response:", response.data);
          }
        })
        .catch((error) => console.error("Error fetching questions:", error));
    },

    validateCharacterLimit(questionId, limit) {
      if (this.answers[questionId].length > limit) {
        this.answers[questionId] = this.answers[questionId].slice(0, limit);
        this.errors[questionId] = `Maximum ${limit} characters allowed.`;
      } else {
        this.errors[questionId] = null;
      }
    },
    remainingCharacters(questionId, limit) {
      return Math.max(0, limit - (this.answers[questionId]?.length || 0));
    },
    validateCurrentQuestion() {
      const currentQuestion = this.currentQuestion;
      const answer = this.answers[currentQuestion.id];
      if (!answer || answer.trim() === "") {
        this.errors[currentQuestion.id] = "This field is required.";
        return false;
      }
      this.errors[currentQuestion.id] = null;
      return true;
    },
    previousQuestion() {
      if (this.currentQuestionIndex > 0) {
        this.currentQuestionIndex--;
      }
    },
    validateAndNext() {
      if (this.validateCurrentQuestion()) {
        this.nextQuestion();
      }
    },
    nextQuestion() {
      if (this.currentQuestionIndex < this.questions.length - 1) {
        this.currentQuestionIndex++;
      }
    },
    submitForm() {
      let isValid = true;
      this.questions.forEach((question) => {
        const answer = this.answers[question.id];
        if (!answer || answer.trim() === "") {
          this.errors[question.id] = "This field is required.";
          isValid = false;
        } else if (question.type === "text" && answer.length > 100) {
          this.errors[question.id] = "Maximum 100 characters allowed.";
          isValid = false;
        } else if (question.type === "textarea" && answer.length > 255) {
          this.errors[question.id] = "Maximum 255 characters allowed.";
          isValid = false;
        } else {
          this.errors[question.id] = null;
        }
      });

      if (isValid) {
        console.log("Form Submitted!", this.answers);
        alert("Form Submitted! Check console for answers.");
      }
    },
  },

  mounted() {
    this.fetchUserData(); // Fetch user data on component mount
    this.fetchQuestions(); // Fetch questions on component mount
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
  /* Change this to your desired focus border color */
  box-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.25);
  /* Adjust this for your desired box shadow */
}
</style>