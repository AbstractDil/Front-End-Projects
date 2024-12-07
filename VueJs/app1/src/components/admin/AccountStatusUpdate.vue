<template>
    <section class="bg-body-tertiary py-4">
        <!-- Profile Information Section Starts -->
        <div class="profile-information container py-4">
            <div class="card p-3">
                <div class="card-body text-start">
                    <h5 class="card-title text-start fw-bold text-success mx-2">
                        <i class="bi bi-person-fill"></i> Account Status
                    </h5>
                    <p class="mx-3 font-sm text-muted mb-3">
                        Change user's account status
                    </p>
                    <div class="alert alert-info mb-3" role="alert">
                        <p>
                            <strong><i class="bi bi-megaphone-fill"></i> Please Note:</strong>
                        <ol>
                            <li>If a user's account is blocked, the system will automatically unblock it after 15
                                minutes.</li>
                            <li>If a user's account is temporarily deleted, the system will automatically restore it
                                after 3 hours.</li>
                        </ol>
                        </p>
                    </div>

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
                                <div class="col-md-12 text-start mb-3">
                                    <p class="fw-bold">
                                       User current status is:
                                        <span :class="getUserTypeClass(userData.user_type)">
                                            {{ getUserTypeLabel(userData.user_type) }}
                                        </span>
                                    </p>
                                    <p class="fw-bold">
                                        <template v-if="userData.user_type === '3'">
                                            <i class="bi bi-calendar-day-fill"></i> Blocked At:
                                            <span class="text-muted">
                                                {{ BlockedDate }}
                                            </span>

                                        </template>
                                        <template v-if="userData.user_type === '0'">
                                            <i class="bi bi-calendar-day-fill"></i> Deleted At:
                                            <span class="text-muted">
                                                {{ DeletedDate }}
                                            </span>
                                        </template>
                                    </p>
                                    
                                </div>
                                <div class="col-md-12 text-start">
                                    <!-- Actions for blocked users -->
                                    <template v-if="userData.user_type === '3'">
                                        <button class="btn btn-success mx-1" @click="updateUserStatus(5)">
                                            Unblock User
                                        </button>

                                    </template>

                                    <!-- Actions for deleted users -->
                                    <template v-else-if="userData.user_type === '0'">
                                        <button class="btn btn-warning mx-1" @click="updateUserStatus(4)">
                                            Restore Account
                                        </button>
                                    </template>

                                    <!-- Actions for active users -->
                                    <template v-else>
                                        <button class="btn btn-danger mx-1 my-1" @click="updateUserStatus(2)">
                                            <i class="bi bi-ban"></i> Block User
                                        </button>
                                        <button class="btn btn-warning mx-1 my-1" @click="updateUserStatus(6)">
                                            <i class="bi bi-trash-fill"></i> Temporarily Delete
                                        </button>
                                    </template>
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
import Swal from 'sweetalert2';


export default {
    name: "AccountStatusUpdate",
    data() {
        return {
            userData: [],
            loading: false,
        };
    },
    computed: {
        ...mapGetters('auth', {
            admId: 'userDetails',
            token: 'token',
        }),

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
                const url = new URL(window.location.href);
                const userId = url.searchParams.get('userId');

                if (userId && this.admId) {
                    const response = await axios.post(`/admin/update-user-details?admId=${this.admId.uid}&req_type=7&uid=${userId}`, {
                        headers: { Authorization: `Bearer ${this.token}` },
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
        async updateUserStatus(reqType) {
            this.loading = true;
            try {
                const url = new URL(window.location.href);
                const userId = url.searchParams.get('userId');

                if (userId && this.admId) {
                    const response = await axios.post(
                        `/admin/update-user-details?admId=${this.admId.uid}&req_type=${reqType}&uid=${userId}`,
                        { headers: { Authorization: `Bearer ${this.token}` } }
                    );

                    if (response.data.status === 200) {
                        Swal.fire('Success!', response.data.message, 'success');
                        // Fetch updated data
                        this.fetchUserData();
                    }
                    else {
                        Swal.fire('Error!', response.data.message, 'error');
                    }

                } else {
                    Swal.fire('Error!', 'User Id or Admin Id is missing!', 'error');

                }
            } catch (error) {
                console.error('Error updating user status:', error);
                Swal.fire('Error!', 'Failed to perform action!', 'error');

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
    mounted() {
        this.fetchUserData();
    },
};
</script>

<style scoped>
.user-details p {
    font-size: 1rem;
    margin-bottom: 0.5rem;
}
</style>
