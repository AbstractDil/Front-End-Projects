<template>
  <div class="container my-5">
    <div class="row">
      <div class="col-md-6 offset-md-3">
        <div class="d-flex justify-content-center align-items-center">
          <!-- Card Starts -->
          <div class="card p-3" style="width: 24em;">
            <div class="card-body">
              <h5 class="card-title text-center mb-4">{{ subtitle }}</h5>
              <form @submit.prevent="handleForm">
                <div class="mb-3">
                  <label class="form-label">Fullname</label>
                  <input type="text" name="name" class="form-control" v-model="userName" required />
                </div>
                <div class="mb-3">
                  <label class="form-label">Email</label>
                  <input type="email" name="email" class="form-control" v-model="userEmail" required />
                </div>
                <div class="mb-3">
                  <label class="form-label">Password</label>
                  <input type="password" name="password" class="form-control" v-model="userPassword" required />
                </div>

                <div class="d-grid gap-2 col-12 mx-auto">
                  <button class="btn btn-primary my-3" type="submit">Register</button>
                </div>
              </form>
              <p class="text-muted mt-4 fs-6">
                Already have an account, <RouterLink to="/login">Login Now</RouterLink>
              </p>
            </div>
          </div>
          <!-- Card Ends -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref } from 'vue';
  import { RouterLink } from 'vue-router';

  defineProps({
    subtitle: {
      type: String,
      required: true
    }
  });

  const userName = ref('');
  const userEmail = ref('');
  const userPassword = ref('');

  const handleForm = async () => {
    const formData = {
      name: userName.value,
      email: userEmail.value,
      password: userPassword.value
    };

    console.log('Form Data:', formData); // Log to verify data before sending

    try {
      const response = await fetch('http://localhost/Sagar/Backend/ApiServer1/index.php/Api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const responseData = await response.json();
      console.log(responseData); // Log the response for debugging

      if (responseData.status === 'success') {
        alert('User registered successfully.');
        // Optionally, redirect to login page
        // router.push('/login');
      } else if (responseData.status === 'error') {
        // Split and display each error message
        const errors = responseData.message.split('\n').filter(msg => msg.trim() !== '');
        alert('Failed to register user:\n' + errors.join('\n'));
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to register user. Please try again.');
    }
  };
</script>

<script>
  export default {
    name: 'RegForm',
    components: {
      RouterLink
    }
  };
</script>


