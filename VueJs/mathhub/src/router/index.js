import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/portal/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'indexPage',
      component: HomeView,
      meta : {title : "Home | MathHub Combined"}
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView,
      meta : {title : "Home | MathHub Combined"}

    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/portal/AboutView.vue'),
      meta : {title : "About |  MathHub Combined"}

    },

    {
      path: '/registration',
      name: 'Registration',
      component: () => import('../views/portal/RegistrationView.vue'),
      meta : {title : "Registration |  MathHub Combined"}

    },

    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/portal/LoginView.vue'),
      meta : {title : "Login |  MathHub Combined"}

    },

    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/user/ProfileView.vue'),
      meta : {title : "Profile |  MathHub Combined"}

    },

    {
      path : '/:catchAll(.*)',
      name: 'PageNotFound',
      component:() => import('../views/error/404Error.vue'),
      meta : {title : " 404 Page Not Found | Sagar Nandy | Welcome to NANDYSAGAR.IN"}


  },
  ]
})

router.beforeEach((to)=>{
  document.title = to.meta.title;
  })

export default router
