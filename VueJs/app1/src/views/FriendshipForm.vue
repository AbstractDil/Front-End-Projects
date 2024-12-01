<template>
  <section class="bg-body-tertiary py-4">

    <!-- Sender photo and name shown here starts -->
    <div class="container">
      <div class="card mb-5 border-success">
        <div class="card-header bg-success text-white text-start">
          <i class="bi bi-info-circle-fill"></i> Sender Information
        </div>
        <div class="card-body">
          <template v-if="isUserLoading">
            <p class="card-text placeholder-glow text-start">
              <span class="placeholder placeholder-lg col-8"></span>
              <span class="placeholder placeholder-lg col-8"></span>
            </p>
          </template>
          <template v-else>
            <div class="d-flex justify-content-start align-items-center">
              <img :src="userdata.profile_photo" alt="UserProfilePic"
                class="img-thumbnail profile-image rounded-circle mx-3">
              <h5 class="text-start">{{ userdata.name }} is waiting for your response.</h5>
            </div>
            <p class="text-end text-muted pb-0 mb-0"> <i class="bi bi-graph-up-arrow"></i> Form Hits Count:{{ totalHits }}
            </p>
          </template>


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
          <template v-if="isQuestionLoading">
            <p class="card-text placeholder-glow">
              <span class="placeholder placeholder-lg col-8"></span>
              <span class="placeholder placeholder-lg col-8"></span>
              <span class="placeholder placeholder-lg col-8"></span>
              <span class="placeholder placeholder-lg col-8"></span>
            </p>
          </template>
          <template v-else>
            <form class="p-4 rounded" @submit.prevent="submitForm">
              <!-- Display only the current question -->
              <div v-if="currentQuestion">
                <h5>{{ currentQuestion.description }}</h5>

                <!-- Text Input -->
                <div v-if="currentQuestion.type === 'text'">
                  <!-- Input Field -->
                  <input v-model="answers['ques_' + currentQuestion.id]" type="text" class="form-control custom-input"
                    @input="validateCharacterLimit(currentQuestion.id, 3, 100)"
                    :placeholder="`Enter your answer (max 100 characters)`" />

                  <!-- Character Limit Feedback -->
                  <small class="text-primary">
                    {{ remainingCharacters(currentQuestion.id, 100) }} characters left
                  </small>

                  <!-- Validation Error -->
                  <div v-if="errors['ques_' + currentQuestion.id]" class="text-danger">
                    {{ errors['ques_' + currentQuestion.id] }}
                  </div>
                </div>


                <!-- Radio Buttons -->
                <div v-if="currentQuestion.type === 'radio'">
                  <div class="form-check" v-for="(option, index) in currentQuestion.options"
                    :key="`radio-${currentQuestion.id}-${index}`">
                    <!-- Input -->
                    <input class="form-check-input custom-input" :id="`radio-${currentQuestion.id}-${index}`"
                      v-model="answers['ques_' + currentQuestion.id]" :value="option.value" type="radio" />
                    <!-- Label -->
                    <label class="form-check-label" :for="`radio-${currentQuestion.id}-${index}`">
                      {{ option.label }}
                    </label>
                  </div>
                  <!-- Validation Error -->
                  <div v-if="errors['ques_' + currentQuestion.id]" class="text-danger">
                    {{ errors['ques_' + currentQuestion.id] }}
                  </div>
                </div>


                <!-- Textarea -->
                <div v-if="currentQuestion.type === 'textarea'">
                  <textarea v-model="answers['ques_' + currentQuestion.id]" class="form-control custom-input"
                    @input="validateCharacterLimit(currentQuestion.id, 3, 255)"></textarea>
                  <small class="text-primary">
                    {{ remainingCharacters(currentQuestion.id, 255) }} characters left
                  </small>
                  <div v-if="errors['ques_' + currentQuestion.id]" class="text-danger">
                    {{ errors['ques_' + currentQuestion.id] }}
                  </div>
                </div>
              </div>

              <!-- CAPTCHA Section -->
              <div class="form-group my-3" v-if="isLastQuestion">
                <!-- <label for="captcha">Captcha</label> -->
                <div class="d-flex align-items-center">
                  <div class="bg-light px-3 py-2 rounded text-success fw-bold me-2">{{ captcha }}</div>
                  <button type="button" class="btn btn-sm btn-link text-muted" @click="generateCaptcha()"> <i
                      class="bi bi-arrow-clockwise"></i> Regenerate</button>
                </div>
                <input type="text" id="captcha" v-model="captchaInput" class="form-control mt-2"
                  placeholder="Enter CAPTCHA" />
                <p v-if="captchaError">
                  <small class="text-danger">CAPTCHA does not match. Please try again.</small>
                </p>
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
                <button type="submit" class="btn btn-success" v-if="isLastQuestion" :disabled="loading">
                  <template v-if="loading">
                    <div class="spinner-border text-light spinner-border-sm" role="status">
                      <span class="visually-hidden">Loading...</span>
                    </div>
                  </template>
                  <template v-else>
                    <i class="bi bi-check2"></i> Submit
                  </template>
                </button>
              </div>
            </form>
          </template>
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
import Swal from 'sweetalert2';

export default {
  name: "FriendshipForm",
  data() {
    return {
      questions: [], // Array to hold questions
      currentQuestionIndex: 0, // Track current question index
      answers: {}, // Store answers keyed by question ID
      errors: {}, // To store validation errors
      userdata: {
        name: '',
        profile_photo: '',
        form_id: '',
      },
      loading: false,
      isUserLoading: false,
      isQuestionLoading: false,
      captcha: '', // Generated CAPTCHA
      captchaInput: '', // User input for CAPTCHA
      captchaError: false, // Flag for CAPTCHA error
      totalHits: 0,
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

    generateCaptcha() {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      this.captcha = Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    },
    fetchUserData(getUserDataUrl) {
      // Set loading to true before the request
      this.isUserLoading = true;
      // Fetch user data
      axios
        .get(getUserDataUrl)
        .then((response) => {
          if (response.data && response.data.data) {
            this.userdata.name = response.data.data.name;
            this.userdata.profile_photo = response.data.data.profile_photo_path;
            this.userdata.form_id = response.data.data.form_id;
          } else {
            Swal.fire('Error!', 'The form ID you provided is invalid. Please check the ID and try again.', 'error');
            this.$router.push('/');
            console.error("Invalid user data response:", response.data);
          }
        })
        .catch((error) => {
          // Handle network or server errors
          Swal.fire('Error!', 'The form ID you provided is invalid. Please check the ID and try again.', 'error');
          this.$router.push('/');
          console.error("Error fetching user data:", error); // Log the error details
        }).finally(() => {
          // Ensure loading is false regardless of success or failure
          this.isUserLoading = false;
        });
    },
    fetchQuestions() {

      // Set loading to true before the request
      this.isQuestionLoading = true;

      axios
        .get("/friendship-questions-2024")
        .then((response) => {
          if (response.data && response.data.data) {
            this.questions = response.data.data;
            this.questions.forEach((question) => {
              this.answers['ques_' + question.id] = ""; // Initialize answers
              this.errors['ques_' + question.id] = null; // Initialize errors
            });
          } else {

            console.error("Invalid API response:", response.data);
          }
        })
        .catch((error) => console.error("Error fetching questions:", error))
        .finally(() => {
          // Ensure loading is false regardless of success or failure
          this.isQuestionLoading = false;
        });
    },

    validateCharacterLimit(questionId, minLength, maxLength) {
      const answerKey = 'ques_' + questionId;
      const answer = this.answers[answerKey];

      // Validate max length
      if (answer.length > maxLength) {
        this.answers[answerKey] = answer.slice(0, maxLength);
        this.errors[answerKey] = `Maximum ${maxLength} characters allowed.`;
      }
      // Validate min length
      else if (answer.length < minLength && answer.length > 0) {
        this.errors[answerKey] = `Minimum ${minLength} characters required.`;
      }
      // Clear error if valid
      else {
        this.errors[answerKey] = null;
      }
    },

    remainingCharacters(questionId, maxLength) {
      return Math.max(0, maxLength - (this.answers['ques_' + questionId]?.length || 0));
    },
    validateCurrentQuestion() {
      const currentQuestion = this.currentQuestion;
      const answer = this.answers['ques_' + currentQuestion.id];
      if (!answer || answer.trim() === "") {
        this.errors['ques_' + currentQuestion.id] = "This field is required.";
        return false;
      }

      // Validate minimum length for text and textarea types
      if ((currentQuestion.type === "text" || currentQuestion.type === "textarea") && answer.length < 3) {
        this.errors['ques_' + currentQuestion.id] = "Minimum 3 characters required.";
        return false;
      }

      this.errors['ques_' + currentQuestion.id] = null;
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
    async submitForm() {
      let isValid = true;
      this.questions.forEach((question) => {
        const answer = this.answers['ques_' + question.id];
        if (!answer || answer.trim() === "") {
          this.errors['ques_' + question.id] = "This field is required.";
          isValid = false;
        } else if (question.type === "text" && answer.length < 3) {
          this.errors['ques_' + question.id] = "Minimum 3 characters required.";
          isValid = false;
        }
        else if (question.type === "text" && answer.length > 100) {
          this.errors['ques_' + question.id] = "Maximum 100 characters allowed.";
          isValid = false;
        }

        else if (question.type === "textarea" && answer.length < 3) {
          this.errors['ques_' + question.id] = "Minimum 3 characters required.";
          isValid = false;
        }

        else if (question.type === "textarea" && answer.length > 255) {
          this.errors['ques_' + question.id] = "Maximum 255 characters allowed.";
          isValid = false;
        } else {
          this.errors['ques_' + question.id] = null;
        }
      });

      // Validate the CAPTCHA
      if (this.captchaInput !== this.captcha) {
        this.captchaError = true;
        Swal.fire('Error!', 'CAPTCHA is incorrect. Please try again.', 'error');
        this.generateCaptcha(); // Regenerate CAPTCHA on error
        return;
      } else {
        this.captchaError = false;
      }


      if (isValid) {
        console.log("Answers", this.answers);
        this.loading = true;
        try {
          const response = await axios.post(`/insert-form-response/${this.userdata.form_id}`, this.answers);
          if (response.data.status == 200) {

            console.log("Form Submitted!", this.answers);
            //alert("Form Submitted! Check console for answers.");

            Swal.fire('Success!', 'Form Submitted!! Create your own form and share it with your friends', 'success');
            this.$router.push('/register');
          } else {
            Swal.fire('Error!', 'Failed to submit form response. Please try again.', 'error');
            console.log("Failed to submit form response!", this.answers);

          }
        } catch (error) {
          if (!error.response) {
            Swal.fire('Connection Error!', 'Backend server is not responding. Please try again later.', 'error');
          } else {
            const statusCode = error.response?.status || 'Unknown';
            const errorMessages = Object.values(error.response?.data?.messages || {}).join(' ') || 'Failed to handle request. Please try again.';
            Swal.fire(`Error ${statusCode}!`, errorMessages, 'error');
          }
        } finally {
          this.loading = false;
        }

      }
    },

    async getTotalHits() {

      this.loading = true;
      const formId = this.$route.params.token;

      try {

        const response = await axios.get(`/form-hit-count/${formId}`);
        if (response.data.status === 200) {
          console.log("Success", response.data);
          this.totalHits = response.data.total_hits;
        } else {
          console.log("Error in fetching data", response.data);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        this.loading = false;
      }

    }

  },

  mounted() {
    // Extract the user ID from the URL
    const userId = this.$route.params.token; // Ensure your route is configured with :id
    console.log(userId);
    const getUserDataUrl = `get-user-data/${userId}`;
    this.fetchUserData(getUserDataUrl); // Fetch user data on component mount
    this.fetchQuestions(); // Fetch questions on component mount
    this.generateCaptcha();
    this.getTotalHits();

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