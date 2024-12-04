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
                    <template v-if="loading">
                        <p class="card-text placeholder-glow">
                            <span class="placeholder col-8 placeholder-lg"></span>
                            <span class="placeholder col-8 placeholder-lg"></span>
                            <span class="placeholder col-8 placeholder-lg"></span>
                            <span class="placeholder col-8 placeholder-lg"></span>
                        </p>
                    </template>
                    <template v-else>
                        <div class="container" v-if="userData">
                            <div class="row">
                                <!-- Profile Image Section -->
                                <div class="col-md-4">
                                    <div class="text-center mt-2 mb-3">
                                        <img :src="userData.profile_photo_path" alt="Profile Picture"
                                            class="rounded-circle profile-image mb-3" />
                                        <p class="mx-3 font-sm text-muted mb-4">
                                            Profile Photo
                                        </p>
                                    </div>
                                </div>
                                <!-- User Details Section -->
                                <div class="col-md-4">
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
                                        <p class="fw-bold">
                                            <i class="bi bi-info-circle-fill"></i> Account Status:
                                            <span :class="getUserTypeClass(userData.user_type)">
                                                {{ getUserTypeLabel(userData.user_type) }}
                                            </span>
                                        </p>
                                    </div>
                                </div>

                                <!-- User Details Section -->
                                <div class="col-md-4">
                                    <div class="user-details">


                                        <p class="fw-bold">
                                            <i class="bi bi-envelope-arrow-up-fill"></i> Form ID:
                                            <span class="text-muted">
                                                {{ userData.form_id }}
                                            </span>
                                        </p>

                                        <p class="fw-bold">
                                            <i class="bi bi-envelope-arrow-up-fill"></i> Form Hits Count:
                                            <span class="text-muted">
                                                {{ totalHits }}
                                            </span>
                                        </p>

                                        <p class="fw-bold">
                                            <i class="bi bi-calendar-day-fill"></i> Blocked At:
                                            <span class="text-muted">
                                                {{ BlockedDate }}
                                            </span>
                                        </p>

                                        <p class="fw-bold">
                                            <i class="bi bi-calendar-day-fill"></i> Deleted At:
                                            <span class="text-muted">
                                                {{ DeletedDate }}
                                            </span>
                                        </p>

                                        <p class="fw-bold">
                                            <i class="bi bi-exclamation-octagon"></i> Failed Attempts:
                                            <span class="text-muted">
                                                {{ userData.failed_attempts }}
                                            </span>
                                        </p>

                                        <p class="fw-bold">
                                            <i class="bi bi-geo-alt-fill"></i> IP Address:
                                            <span class="text-muted">
                                                {{ userData.ip_address }}
                                            </span>
                                        </p>

                                    </div>
                                </div>

                            </div>
                        </div>
                    </template>
                </div>
            </div>
        </div>
        <!-- Profile Information Section Ends -->
    </section>
</template>

<script>
import { mapGetters } from 'vuex';
import axios from 'axios';

export default {
    name: "ProfileInfo",
    data() {
        return {
            userData: [],
            loading: false,
            totalHits: 0
        };
    },
    computed: {
        ...mapGetters('auth', {
            admId: 'userDetails',
        }),
        joinedDate() {
            return this.userData?.created_at
                ? this.formatDate(this.userData.created_at)
                : 'Not Available';
        },
        updatedDate() {
            return this.userData?.updated_at
                ? this.formatDate(this.userData.updated_at)
                : 'Not Available';
        },
        verificationDate() {
            return this.userData?.email_verified_at
                ? this.formatDate(this.userData.email_verified_at)
                : 'Not Verified';
        },
        BlockedDate() {
            return this.userData?.blocked_at
                ? this.formatDate(this.userData.blocked_at)
                : 'Not Available';
        },
        DeletedDate() {
            return this.userData?.deleted_at
                ? this.formatDate(this.userData.deleted_at)
                : 'Not Available';
        },
    },
    methods: {
        async fetchUserData() {
            this.loading = true;
            try {
                // Parse userId from URL
                const url = new URL(window.location.href);
                const userId = url.searchParams.get('userId');

                if (userId && this.admId) {
                    const response = await axios.post(`/admin/update-user-details?admId=${this.admId.uid}&req_type=7&uid=${userId}`, {
                        headers: { Authorization: `Bearer ${this.admId.token}` },
                    });

                    this.userData = response.data.data;
                } else {
                    console.error('User ID or admId is missing');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                this.loading = false;
            }
        },

        async getTotalHits() {

            this.loading = true;

            try {

                const response = await axios.get(`/form-hit-count/${this.userData.form_id}`);
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

        },

        getUserTypeLabel(userType) {
            switch (parseInt(userType, 10)) {
                case 0:
                    return "Deleted";
                case 1:
                    return "Active";
                case 2:
                    return "Admin";
                case 3:
                    return "Blocked";
                default:
                    return "Unknown";
            }
        },

        getUserTypeClass(userType) {
            switch (parseInt(userType, 10)) {
                case 0:
                    return "badge bg-danger";
                case 1:
                    return "badge bg-success";
                case 2:
                    return "badge bg-primary";
                case 3:
                    return "badge bg-warning text-dark";
                default:
                    return "badge bg-secondary";
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
    async mounted() {
        this.loading = true;

        try {
            await this.fetchUserData(); // Wait for user data to be fetched
            if (this.userData && this.userData.form_id) {
                await this.getTotalHits(); // Fetch total hits only if form_id is available
            } else {
                console.error('form_id is missing in userData');
            }
        } catch (error) {
            console.error('Error during initialization:', error);
        } finally {
            this.loading = false;
        }
    }

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
