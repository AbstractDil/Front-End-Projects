<template>
    <section class="bg-body-tertiary py-4">
      <!-- Form Starts Here -->
      <div class="container text-start">
        <div class="card mt-5">
          <div class="card-body">
            <form class="p-4 rounded">
              <!-- Display only the current question -->
              <div v-if="currentQuestion">
                <h5>{{ currentQuestion.description }}</h5>
  
                <!-- Input Types -->
                <!-- Text Input -->
                <div v-if="currentQuestion.type === 'text'">
                  <input
                    v-model="answers[currentQuestion.id]"
                    type="text"
                    class="form-control custom-input"
                  />
                </div>
  
                <!-- Radio Buttons -->
                <div v-if="currentQuestion.type === 'radio'">
                  <div
                    class="form-check"
                    v-for="(option, index) in currentQuestion.options"
                    :key="`radio-${currentQuestion.id}-${index}`"
                  >
                    <input
                      class="form-check-input custom-input"
                      :id="`radio-${currentQuestion.id}-${index}`"
                      v-model="answers[currentQuestion.id]"
                      :value="option.value"
                      type="radio"
                    />
                    <label
                      class="form-check-label"
                      :for="`radio-${currentQuestion.id}-${index}`"
                    >
                      {{ option.label }}
                    </label>
                  </div>
                </div>
  
                <!-- Textarea -->
                <div v-if="currentQuestion.type === 'textarea'">
                  <textarea
                    v-model="answers[currentQuestion.id]"
                    class="form-control custom-input"
                  ></textarea>
                </div>
              </div>
  
              <!-- Navigation Buttons -->
              <div class="mt-4">
                <button
                  type="button"
                  class="btn btn-secondary me-2"
                  @click="previousQuestion"
                  :disabled="currentQuestionIndex === 0"
                >
                <i class="bi bi-chevron-left"></i> Previous
                </button>
                <button
                  type="button"
                  class="btn btn-outline-success me-2"
                  @click="nextQuestion"
                  v-if="!isLastQuestion"
                >
                  Next <i class="bi bi-chevron-right"></i> ({{ formattedProgress }})
                </button>
                <button
                  type="submit"
                  class="btn btn-success"
                  v-if="isLastQuestion"
                  @click.prevent="submitForm"
                >
                <i class="bi bi-check2"></i> Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <!-- Form Ends Here -->
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
      };
    },
    computed: {
      // Get the current question
      currentQuestion() {
        return this.questions[this.currentQuestionIndex] || null;
      },
      // Check if the current question is the last question
      isLastQuestion() {
        return this.currentQuestionIndex === this.questions.length - 1;
      },
      // Format progress as "01/10"
      formattedProgress() {
        return (
          String(this.currentQuestionIndex + 1).padStart(2, "0") +
          "/" +
          String(this.questions.length).padStart(2, "0")
        );
      },
    },
    mounted() {
      // Fetch questions and initialize answers using Axios
      axios
        .get("/friendship-questions-2024") // Replace with your actual API endpoint
        .then((response) => {
          // Ensure response contains the `data` array
          if (response.data && response.data.data) {
            this.questions = response.data.data;
            this.questions.forEach((question) => {
              this.answers[question.id] = null; // Initialize answers
            });
          } else {
            console.error("Invalid API response:", response.data);
          }
        })
        .catch((error) => console.error("Error fetching questions:", error));
    },
    methods: {
      // Move to the previous question
      previousQuestion() {
        if (this.currentQuestionIndex > 0) {
          this.currentQuestionIndex--;
        }
      },
      // Move to the next question
      nextQuestion() {
        if (this.currentQuestionIndex < this.questions.length - 1) {
          this.currentQuestionIndex++;
        }
      },
      // Handle form submission
      submitForm() {
        console.log("Form Submitted!", this.answers);
        alert("Form Submitted! Check console for answers.");
      },
    },
  };
  </script>
  
  <style scoped>
.custom-input:focus {
    border-color: #42b983; /* Change this to your desired focus border color */
    box-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.25); /* Adjust this for your desired box shadow */
}
</style>
  