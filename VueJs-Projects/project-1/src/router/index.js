import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'indexPage',
      component: HomeView,
      meta : {title : "Index Page "}
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView,
      meta : {title : "Home Page "}

    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
      meta : {title : "About Page "}

    },

    {
      path: '/registration',
      name: 'Registration',
      component: () => import('../views/RegistrationView.vue'),
      meta : {title : "Registration Page "}

    },

    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/LoginView.vue'),
      meta : {title : "Login Page "}

    }
  ]
})

router.beforeEach((to)=>{
  document.title = to.meta.title;
  })

export default router
