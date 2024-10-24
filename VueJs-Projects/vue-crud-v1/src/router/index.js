import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import store from '../store' // Import the Vuex store

const routes = [
  {
    path: '/',
    name: 'LoginForm',
    component: LoginView,
    meta: {
      title: 'Login - Vue Js Crud',
      requiresGuest: true // Indicate that this route is for guests only
    }
  },
  {
    path: '/register',
    name: 'RegistrationForm',
    component: () => import(/* webpackChunkName: "register" */ '../views/RegisterView.vue'),
    meta: {
      title: 'Register - Vue Js Crud',
      requiresGuest: true // Indicate that this route is for guests only
    }
  },
  {
    path: '/verify-email/:token',
    name: 'VerifyEmail',
    component: () => import(/* webpackChunkName: "verify" */ '../views/VerifyEmail.vue'),
    meta: {
      title: 'Verify Email - Vue Js Crud'
    }
  },
  {
    path: '/forget-password',
    name: 'ForgetPassword',
    component: () => import(/* webpackChunkName: "forget" */ '../views/ForgetPassword.vue'),
    meta: {
      title: 'Forget Password - Vue Js Crud',
      requiresGuest: true // Indicate that this route is for guests only
    }
  },
  {
    path: '/change-password',
    name: 'ChangePassword',
    component: () => import(/* webpackChunkName: "change" */ '../views/ChangePassword.vue'),
    meta: {
      title: 'Change Password - Vue Js Crud'
    }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import(/* webpackChunkName: "profile" */ '../views/ProfileView.vue'),
    meta: {
      title: 'Profile - Vue Js Crud',
      requiresAuth: true // Indicate that this route requires authentication
    }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

// Navigation guard to update document title and manage route access
router.beforeEach((to, from, next) => {
  const isLoggedIn = store.getters['auth/isLoggedIn'];

  // Update the document title
  document.title = to.meta.title || 'Default Title'

  // If the route requires guest access and the user is logged in, redirect to the profile page
  if (to.meta.requiresGuest && isLoggedIn) {
    return next({ name: 'Profile' }) // Redirect logged-in users trying to access guest routes
  }

  // If the route requires authentication and the user is not logged in, redirect to the login page
  if (to.meta.requiresAuth && !isLoggedIn) {
    return next({ name: 'LoginForm' }) // Redirect unauthenticated users to login
  }

  next() // Proceed to the next route
})

export default router
