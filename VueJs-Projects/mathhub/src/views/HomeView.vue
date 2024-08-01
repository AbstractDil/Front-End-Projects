<template>
  <main>
    <Carousel />
    <h1 class="text-danger text-center my-5">Home Page</h1>
    
    <div class="container">
      <h2 class="text-center my-5">Users List</h2>
      <div class="table-responsive">
        <table class="table table-bordered">
          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Name</th>
              <th scope="col">Email</th>
              <th scope="col">Created At</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.id">
              <td>{{ user.id }}</td>
              <td>{{ user.name }}</td>
              <td>{{ user.email }}</td>
              <td>{{ user.created_at }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import Carousel from '../components/Carousel.vue';

// Users state
const users = ref([]);

const fetchUrl = 'http://localhost/Sagar/Backend/ApiServer2/api';
// Function to fetch users
const fetchUsers = async () => {
  try {
    // Change the URL to use the proxied '/api' path
    const response = await axios.get(fetchUrl);
    users.value = response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};


// Fetch users on component mount
onMounted(fetchUsers);
</script>
