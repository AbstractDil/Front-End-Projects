<template>
    <section class="bg-body-tertiary py-4">
      <div class="container">
        <h1 class="mb-4">All Users</h1>
        <!-- Search Box -->
        <div class="mb-3">
          <input
            type="text"
            v-model="searchQuery"
            class="form-control"
            placeholder="Search by name or email"
          />
        </div>
  
        <!-- Users Table -->
        <table class="table table-striped">
          <thead>
            <tr>
              <th>#</th>
              <th>Photo</th>
              <th>Name</th>
              <th>Email</th>
              <th>User Type</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(user, index) in paginatedUsers" :key="user.id">
              <td>{{ index + 1 + (currentPage - 1) * itemsPerPage }}</td>
              <td>
                <img
                  :src="user.photo || defaultPhoto"
                  alt="User Photo"
                  class="rounded-circle"
                  width="50"
                  height="50"
                />
              </td>
              <td>{{ user.name }}</td>
              <td>{{ user.email }}</td>
              <td>
                <span :class="getUserTypeClass(user.user_type)">
                  {{ getUserTypeLabel(user.user_type) }}
                </span>
              </td>
              <td>{{ new Date(user.created_at).toLocaleDateString() }}</td>
            </tr>
          </tbody>
        </table>
  
        <!-- Pagination -->
        <nav v-if="totalPages > 1">
          <ul class="pagination">
            <li class="page-item" :class="{ disabled: currentPage === 1 }">
              <button class="page-link" @click="changePage(currentPage - 1)">Previous</button>
            </li>
            <li
              class="page-item"
              v-for="page in totalPages"
              :key="page"
              :class="{ active: page === currentPage }"
            >
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
        itemsPerPage: 5,
        defaultPhoto: "/Images/User-avatar.png", // Fallback image for users without a photo
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
        const userId = this.$store.getters["auth/userId"];
        axios
          .get(`admin/get-all-users/${userId}`)
          .then((response) => {
            this.users = response.data.users;
          })
          .catch((error) => {
            console.error("Error fetching users:", error);
          });
      },
      changePage(page) {
        if (page >= 1 && page <= this.totalPages) {
          this.currentPage = page;
        }
      },
      getUserTypeLabel(userType) {
        switch (userType) {
          case 0:
            return "Account Deleted Temporarily";
          case 1:
            return "Active";
          case 2:
            return "Admin";
          case 3:
            return "Account Blocked Temporarily";
          default:
            return "Unknown";
        }
      },
      getUserTypeClass(userType) {
        switch (userType) {
          case 0:
            return "badge bg-warning text-dark";
          case 1:
            return "badge bg-success";
          case 2:
            return "badge bg-primary";
          case 3:
            return "badge bg-danger";
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
  