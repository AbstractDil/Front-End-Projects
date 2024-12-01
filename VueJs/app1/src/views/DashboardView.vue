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
          <div class="container" v-if="userDetails">
            <div class="row">
              <!-- Profile Image Section -->
              <div class="col-md-4">
                <div class="text-center mt-2 mb-3">
                  <img :src="userDetails.profile_photo_path" alt="Profile Picture"
                    class="rounded-circle profile-image mb-3" />
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
                    <span class="text-muted">{{ userDetails.name }}</span>
                  </p>
                  <p class="fw-bold">
                    <i class="bi bi-envelope-fill"></i> Email:
                    <span class="text-muted">{{ userDetails.email }}</span>
                  </p>
                  <p class="fw-bold">
                    <i class="bi bi-calendar-day-fill"></i> Joined on:
                    <span class="text-muted">{{ joinedDate }}</span>
                  </p>
                  <p class="fw-bold">
                    <i class="bi bi-envelope-fill"></i> Email verification
                    status:
                    <template v-if="userDetails.is_email_verified == 1">
                      <span class="badge text-bg-success">
                        <i class="bi bi-shield-fill-check"></i> Verified</span>
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
    <!-- Other Cards Shows Here - Ends -->

    <!-- Social Media Links to Share Friendship Form Starts -->
    <div class="social-media container py-4">
      <div class="card p-3">
        <div class="card-body text-start">
          <h5 class="card-title text-start fw-bold text-success mx-2">
            <i class="bi bi-person-fill"></i> Share with your friends
          </h5>
          <p class="mx-3 font-sm text-muted mb-4">
            Share this friendship form with your friends to see what they think of you.
          </p>
          <div class="container" v-if="userDetails">
            <div class="row text-center">
              <div class="col">
                <!-- WhatsApp -->
                <a :href="`https://wa.me/?text=${shareUrl}`" target="_blank" class="text-success text-decoration-none">
                  <i class="bi bi-whatsapp fs-4"></i>
                  <p class="text-muted">WhatsApp</p>
                </a>
              </div>
              <div class="col">
                <!-- Facebook -->
                <a :href="`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`" target="_blank"
                  class="text-primary text-decoration-none">
                  <i class="bi bi-facebook fs-4"></i>
                  <p class="text-muted">Facebook</p>
                </a>
              </div>
              <div class="col">
                <!-- Instagram -->
                <a :href="`https://www.instagram.com/url=${shareUrl}`" target="_blank"
                  class="text-danger text-decoration-none">
                  <i class="bi bi-instagram fs-4"></i>
                  <p class="text-muted">Instagram</p>
                </a>
              </div>
            </div>

            <!-- Copy Text Section -->
            <div class="mt-4">
              <label for="shareText" class="form-label fw-bold text-success"> <i class="bi bi-share-fill"></i> Copy and Share </label>
              <div class="input-group">
                <input type="text" id="shareText" class="form-control" rows="2" v-model="shareText" readonly>
                <button class="btn btn-outline-success" @click="copyToClipboard">
                  <i class="bi bi-copy"></i> Copy
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
    <!-- Social Media Links to Share Friendship Form Ends -->



  </section>
</template>

<script>
import { mapGetters } from 'vuex';
import Swal from 'sweetalert2';


export default {
  name: "ProfileInfo",
  data() {
    return {
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
          redirect_url: "", // Initially empty
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
  computed: {
    joinedDate() {
      return this.userDetails?.created_at
        ? this.formatDate(this.userDetails.created_at)
        : 'Not Available';
    },
    updatedDate() {
      return this.userDetails?.updated_at
        ? this.formatDate(this.userDetails.updated_at)
        : 'Not Available';
    },
    verificationDate() {
      return this.userDetails?.email_verified_at
        ? this.formatDate(this.userDetails.email_verified_at)
        : 'Not Verified';
    },
    ...mapGetters('auth', {
      userDetails: 'userDetails',
    }),
    shareUrl() {
      if (this.userDetails && this.userDetails.form_id) {
        const baseUrl = `${window.location.origin}/friendship-form/${this.userDetails.form_id}`;
        const name = this.userDetails.name || 'Your friend'; // Fallback to a generic name if none exists
        return encodeURIComponent(`😁😁 ${name} has sent you a friendship challenge! Participate now: 😁😁 ${baseUrl}`);
      }
      return '';
    },

    shareText() {
      if (this.userDetails && this.userDetails.form_id) {
        const baseUrl = `${window.location.origin}/friendship-form/${this.userDetails.form_id}`;
        const name = this.userDetails.name || 'Your friend'; // Fallback to a generic name if none exists
        return `😁😁 ${name} has sent you a friendship challenge! Participate now: 😁😁 ${baseUrl}`;
      }
      return '';
    }

  },
  watch: {
    userDetails: {
      immediate: true,
      handler(newValue) {
        if (newValue) {
          this.fetchUserData();
        }
      },
    },
  },
  methods: {
    async fetchUserData() {
      if (this.userDetails?.form_id) {
        const cardIndex = this.cards.findIndex(card => card.card_id === "2");
        if (cardIndex !== -1) {
          this.cards[cardIndex] = {
            ...this.cards[cardIndex],
            redirect_url: `/friendship-form/${this.userDetails.form_id}`,
          }
        }
      }

    },

    copyToClipboard() {
      const shareTextArea = document.getElementById('shareText');
      shareTextArea.select();
      shareTextArea.setSelectionRange(0, 99999); // For mobile devices
      document.execCommand('copy');
      Swal.fire('Success!', 'Text copied to clipboard!', 'success');
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
