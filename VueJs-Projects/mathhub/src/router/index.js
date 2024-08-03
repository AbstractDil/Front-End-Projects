import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

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
      component: () => import('../views/AboutView.vue'),
      meta : {title : "About |  MathHub Combined"}

    },

    {
      path: '/registration',
      name: 'Registration',
      component: () => import('../views/RegistrationView.vue'),
      meta : {title : "Registration |  MathHub Combined"}

    },

    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/LoginView.vue'),
      meta : {title : "Login |  MathHub Combined"}

    }
  ]
})

router.beforeEach((to)=>{
  document.title = to.meta.title;
  })

export default router
