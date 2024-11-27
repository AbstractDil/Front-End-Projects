<template>
  <section class="bg-body-tertiary py-4">
    <!-- Profile Information Section Starts -->
    <div class="profile-information container py-4">
      <div class="card p-3">
        <div class="card-body text-start">
          <h5 class="card-title text-start fw-bold text-success mx-2">
            <i class="bi bi-person-fill"></i> Profile Information
          </h5>
          <p class="mx-3 font-sm text-muted mb-4">
            View your account's profile information and email address.
          </p>
          <div class="container">
            <div class="row">
              <!-- Profile Image Section -->
              <div class="col-md-4">
                <div class="text-center mt-2 mb-3">
                  <img
                    :src="profileImage"
                    alt="Profile Picture"
                    class="rounded-circle profile-image mb-3"
                  />
                  <p class="mx-3 font-sm text-muted mb-4">
                <RouterLink to="/profile">Change Photo</RouterLink>
                  </p>
                </div>
              </div>
              <!-- User Details Section -->
              <div class="col-md-6">
                <div class="user-details">
                  <p class="fw-bold">
                    <i class="bi bi-person-circle"></i> Full Name:
                    <span class="text-muted">{{ userData.name }}</span>
                  </p>
                  <p class="fw-bold">
                    <i class="bi bi-envelope-fill"></i> Email:
                    <span class="text-muted">{{ userData.email }}</span>
                  </p>
                  <p class="fw-bold">
                    <i class="bi bi-calendar-day-fill"></i> Joined on:
                    <span class="text-muted">{{ joinedDate }}</span>
                  </p>
                  <p class="fw-bold">
                    <i class="bi bi-envelope-fill"></i> Email verification
                    status:
                    <template v-if="userData.is_email_verified == 1">
                      <span class="badge text-bg-success">
                        <i class="bi bi-shield-fill-check"></i> Verified</span
                      >
                    </template>
                    <template v-else>
                      <span class="badge text-bg-warning">
                        <i class="bi bi-envelope-exclamation-fill"></i> Not
                        verified
                      </span>
                    </template>
                  </p>
                  <p class="fw-bold">
                    <i class="bi bi-calendar-day-fill"></i> Verified on:
                    <span class="text-muted">{{ verificationDate }}</span>
                  </p>
                  <p class="fw-bold">
                    <i class="bi bi-calendar-day-fill"></i> Profile updated on:
                    <span class="text-muted">{{ updatedDate }}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Profile Information Section Ends -->

    <!-- Other Cards Shows Here - Starts -->
    <div class="container py-4">
      <div class="row">
        <div class="col-sm-4 mb-3 mb-sm-0" v-for="card in cards" v-bind:key="card.card_id">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title fs-2" v-html="card.card_icon"></h5>
              <p class="card-text fs-4">{{ card.card_name }}</p>
              <RouterLink :to="card.redirect_url" class="btn btn-success">
                <i class="bi bi-box-arrow-up-right"></i> Click Here
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import axios from "axios";

export default {
  name: "ProfileInfo",
  data() {
    return {
      userData: {
        name: "",
        email: "",
        created_at: "",
        is_email_verified: "",
        updated_at: "",
        email_verified_at: "",
        form_id: "",
      },
      profileImage: "/Images/User-avatar.png", // Default profile image path
      token: localStorage.getItem("token"),
      userId: localStorage.getItem("userId"),
      cards: [
        {
          card_id: "1",
          card_name: "Profile Settings",
          card_icon: '<i class="bi bi-person-fill-gear text-success"></i>',
          redirect_url: "/profile",
        },
        {
          card_id: "2",
          card_name: "Friendship Form",
          card_icon: '<i class="bi bi-ui-checks-grid text-success"></i>',
          redirect_url: "", // Initially empty, will be updated dynamically
        },
        {
          card_id: "3",
          card_name: "Form Responses",
          card_icon: '<i class="bi bi-chat-heart-fill text-success"></i>',
          redirect_url: "/form-responses",
        },
      ],
    };
  },
  created() {
    this.fetchUserData();
  },
  computed: {
    joinedDate() {
      return this.formatDate(this.userData.created_at);
    },
    updatedDate() {
      return this.formatDate(this.userData.updated_at);
    },
    verificationDate() {
      return this.formatDate(this.userData.email_verified_at);
    },
  },
  watch: {
    "userData.form_id"(newFormId) {
      // Update the redirect URL for card 2 when form_id is updated
      const cardIndex = this.cards.findIndex((card) => card.card_id === "2");
      if (cardIndex !== -1) {
        this.cards[cardIndex].redirect_url = `/friendship-form/${newFormId}`;
      }
    },
  },
  methods: {
    async fetchUserData() {
      try {
        if (this.userId && this.token) {
          const response = await axios.get(`/show-user/${this.userId}`, {
            headers: { Authorization: `Bearer ${this.token}` },
          });

          this.userData = { ...this.userData, ...response.data.data };
          this.profileImage =
            response.data.data.profile_photo_path || this.profileImage;

          // Update card's redirect_url immediately if form_id is available
          if (this.userData.form_id) {
            const cardIndex = this.cards.findIndex((card) => card.card_id === "2");
            if (cardIndex !== -1) {
              this.cards[cardIndex].redirect_url = `/friendship-form/${this.userData.form_id}`;
            }
          }
        } else {
          console.error("User ID or token is not available");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    },
    formatDate(dateString) {
      if (!dateString) return "";
      const date = new Date(dateString);
      const options = {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      };
      return new Intl.DateTimeFormat("en-US", options).format(date);
    },
  },
};
</script>

<style scoped>
.profile-image {
  width: 150px;
  height: 150px;
  object-fit: cover;
  border-radius: 50%;
  border: 2px solid #28a745;
}

.user-details p {
  font-size: 1rem;
  margin-bottom: 0.5rem;
}
</style>
