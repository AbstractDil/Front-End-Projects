import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'

const routes = [
  {
    path: '/',
    name: 'LoginForm',
    component: LoginView,
    meta: {
      title: 'Login - Vue Js Crud' // Set the title for the login page
    }
  },
  {
    path: '/register',
    name: 'RegistrationForm',
    component: () => import(/* webpackChunkName: "about" */ '../views/RegisterView.vue'),
    meta: {
      title: 'Register - Vue Js Crud' // Set the title for the register page
    }
  },

  {
    path: '/verify-email/:token',
    name: 'VerifyEmail',
    component: () => import('../views/VerifyEmail.vue'),
    meta: {
      title: 'Verify Email - Vue Js Crud' // Set the title for the register page
    }
  },

  {
    path: '/forget-password',
    name: 'Forget Password',
    component: () => import(/* webpackChunkName: "about" */ '../views/ForgetPassword.vue'),
    meta: {
      title: 'Forget Password - Vue Js Crud' // Set the title for the register page
    }
  }, 

  {
    path: '/change-password',
    name: 'Change Password',
    component: () => import(/* webpackChunkName: "about" */ '../views/ChangePassword.vue'),
    meta: {
      title: 'Change Password - Vue Js Crud' // Set the title for the register page
    }
  }, 

  {
    path: '/profile',
    name: 'Profile',
    component: () => import(/* webpackChunkName: "about" */ '../views/ProfileView.vue'),
    meta: {
      title: 'Profile - Vue Js Crud' // Set the title for the register page
    }
  }, 

]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

// Navigation guard to update document title
router.beforeEach((to, from, next) => {
  document.title = to.meta.title || 'Default Title'; // Set the document title
  next();
})

export default router
