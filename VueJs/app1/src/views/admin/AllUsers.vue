<template>
  <section class="bg-body-tertiary py-4">
    <div class="container">
      <h1 class="mb-4 text-muted">List All Users</h1>
      <!-- Search Box -->
      <div class="mb-3">
        <input type="text" v-model="searchQuery" class="form-control" placeholder="Search by name or email" />
      </div>

      <!-- Users Table -->

      <template v-if="loading">
          <p class="card-text placeholder-glow">
          <span class="placeholder col-8 placeholder-lg"></span>
          <span class="placeholder col-8 placeholder-lg"></span>
          <span class="placeholder col-8 placeholder-lg"></span>
          <span class="placeholder col-8 placeholder-lg"></span>
          <span class="placeholder col-8 placeholder-lg"></span>
        </p>
        </template>

        <template v-else>
          <div class="table-responsive">
      <table class="table table-striped">
        <thead>
          <tr>
            <th>Sl. No.</th>
            <th>Created At</th>
            <th>Ip Address</th>
            <th>Photo</th>
            <th>Name</th>
            <th>Email</th>
            <th>User Type</th>
            <th>Form Hits</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <template v-if="paginatedUsers.length > 0">
            <tr v-for="(user, index) in paginatedUsers" :key="user.id">
              <td class="text-muted">{{ index + 1 + (currentPage - 1) * itemsPerPage }}</td>
              <td class="text-muted">{{ new Date(user.created_at).toLocaleString() }}</td>
              <td class="text-muted">{{ user.ip_address }}</td>

              <td>
                <img :src="user.profile_photo_path || defaultPhoto" alt="User Photo" class="rounded-circle" width="30" height="30" />
              </td>

              <td class="text-muted">{{ user.name }}</td>
              <td class="text-muted">{{ user.email }}</td>
              <td>
                <span :class="getUserTypeClass(user.user_type)">
                  {{ getUserTypeLabel(user.user_type) }}
                </span>
              </td>
              <td>
                {{ user.form_hit_count }}
              </td>
              <td>
                <router-link class="btn btn-warning btn-sm mx-1 my-1 " :to="`/admin/view-user-details?userId=${user.id}`">
                  <i class="bi bi-eye-fill"></i>
                </router-link>

                <router-link class="btn btn-success btn-sm mx-1 my-1 " :to="`/admin/view-form-responses?formId=${user.form_id}&userId=${user.id}`">
                  <i class="bi bi-chat-dots"></i>
                </router-link>

                <router-link class="btn btn-danger btn-sm mx-1 my-1 " :to="`/friendship-form/${user.form_id}`">
                  <i class="bi bi-box-arrow-up-right"></i>
                </router-link>

              </td>
            </tr>
          </template>
          <template v-else>
            <tr>
              <td colspan="8" class="text-center text-muted">No data found</td>
            </tr>
          </template>
        </tbody>

      </table>
    </div>
    </template>

      <!-- Pagination -->
      <nav v-if="totalPages > 1">
        <ul class="pagination">
          <li class="page-item" :class="{ disabled: currentPage === 1 }">
            <button class="page-link" @click="changePage(currentPage - 1)">Previous</button>
          </li>
          <li class="page-item" v-for="page in totalPages" :key="page" :class="{ active: page === currentPage }">
            <button class="page-link" @click="changePage(page)">{{ page }}</button>
          </li>
          <li class="page-item" :class="{ disabled: currentPage === totalPages }">
            <button class="page-link" @click="changePage(currentPage + 1)">Next</button>
          </li>
        </ul>
      </nav>
    </div>
  </section>
</template>

<script>
import axios from "axios";

export default {
  name: "AllUsers",
  data() {
    return {
      users: [],
      searchQuery: "",
      currentPage: 1,
      itemsPerPage: 10,
      defaultPhoto: "/Images/User-avatar.png", // Fallback image for users without a photo
      loading:false
    };
  },
  computed: {
    filteredUsers() {
      if (!this.searchQuery) return this.users;
      const query = this.searchQuery.toLowerCase();
      return this.users.filter(
        (user) =>
          user.name.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query)
      );
    },
    paginatedUsers() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredUsers.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredUsers.length / this.itemsPerPage);
    },
  },
  methods: {
    fetchUsers() {
      this.loading = true;
      const userId = this.$store.getters["auth/userId"];
      const token = this.$store.getters["auth/token"];
      axios
        .post(`admin/get-all-users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }

        )
        .then((response) => {
          this.users = response.data.data;
        })
        .catch((error) => {
          console.error("Error fetching users:", error);
        }).finally(() => {
      this.loading = false;
    });
    },
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
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

   

  },
  mounted() {
    this.fetchUsers();
  },
};
</script>

<style>
.table img {
  object-fit: cover;
}

.pagination {
  justify-content: center;
}


</style>