import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '../views/LoginView.vue';
import store from '../store'; // Import the Vuex store

const routes = [
  {
    path: '/',
    name: 'LoginForm',
    component: LoginView,
    meta: {
      title: 'Login - iFriendShip - v0.1.0',
      requiresGuest: true,
    },
  },
  {
    path: '/register',
    name: 'RegistrationForm',
    component: () =>
      import(/* webpackChunkName: "register" */ '../views/RegisterView.vue'),
    meta: {
      title: 'Register - iFriendShip - v0.1.0',
      requiresGuest: true,
    },
  },
  {
    path: '/verify-email/:token',
    name: 'VerifyEmail',
    component: () =>
      import(/* webpackChunkName: "verify" */ '../views/VerifyEmail.vue'),
    meta: {
      title: 'Verify Email - iFriendShip - v0.1.0',
    },
  },
  {
    path: '/forget-password',
    name: 'ForgetPassword',
    component: () =>
      import(/* webpackChunkName: "forget" */ '../views/ForgetPassword.vue'),
    meta: {
      title: 'Forget Password - iFriendShip - v0.1.0',
      requiresGuest: true,
    },
  },

  {
    path: '/email-verification',
    name: 'EmailVerification',
    component: () =>
      import(/* webpackChunkName: "forget" */ '../views/EmailVerification.vue'),
    meta: {
      title: 'Email Verification - iFriendShip - v0.1.0',
      requiresGuest: true,
    },
  },

  {
    path: '/change-password/:token',
    name: 'ChangePassword',
    component: () =>
      import(/* webpackChunkName: "change" */ '../views/ChangePassword.vue'),
    meta: {
      title: 'Change Password - iFriendShip - v0.1.0',
    },
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () =>
      import(/* webpackChunkName: "profile" */ '../views/DashboardView.vue'),
    meta: {
      title: 'Dashboard - iFriendShip - v0.1.0',
      requiresAuth: true,
    },
  },
  {
    path: '/friendship-form/:token',
    name: 'FriendshipForm',
    component: () =>
      import(/* webpackChunkName: "profile" */ '../views/FriendshipForm.vue'),
    meta: {
      title: 'Friendship Form - iFriendShip - v0.1.0',
      requiresGuest: false,
    },
  },

  {
    path: '/form-responses',
    name: 'FormResponses',
    component: () =>
      import(/* webpackChunkName: "profile" */ '../views/FormResponses.vue'),
    meta: {
      title: 'Form Responses - iFriendShip - v0.1.0',
      requiresAuth: true,
    },
  },

  {
    path: '/profile',
    name: 'Profile',
    component: () =>
      import(/* webpackChunkName: "profile" */ '../views/ProfileView.vue'),
    meta: {
      title: 'Profile - iFriendShip - v0.1.0',
      requiresAuth: true,
    },
  },
  {
    path: '/:catchAll(.*)',
    name: 'PageNotFound',
    component: () => import('../views/error/404Error.vue'),
    meta: { title: '404 Page Not Found - iFriendShip - v0.1.0' },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

// Navigation guard to update document title and manage route access
router.beforeEach(async (to, from, next) => {
  const isLoggedIn = store.getters['auth/isLoggedIn'];

  // Dispatch Vuex action to show loading
  await store.dispatch('ui/setLoading', true);

  // Update the document title
  document.title = to.meta.title || 'Default Title';

  // If the route requires guest access and the user is logged in, redirect to the profile page
  if (to.meta.requiresGuest && isLoggedIn) {
    store.dispatch('ui/setLoading', false); // Stop loading before redirect
    return next({ name: 'Dashboard' }); // Redirect logged-in users trying to access guest routes
  }

  // If the route requires authentication and the user is not logged in, redirect to the login page
  if (to.meta.requiresAuth && !isLoggedIn) {
    store.dispatch('ui/setLoading', false); // Stop loading before redirect
    return next({ name: 'LoginForm' }); // Redirect unauthenticated users to login
  }

  next(); // Proceed to the next route
});

router.afterEach(() => {
  // Stop loading after navigation
  store.dispatch('ui/setLoading', false);
});

export default router;
