import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'index',
      component: HomeView
    },

    {
      path : '/home',
      name: 'home',
      component:() => import('../views/HomeView.vue')
    },

    {
        path : '/about',
        name: 'about',
        component:() => import('../views/AboutView.vue')
    },

    {
        path : '/:catchAll(.*)',
        name: 'PageNotFound',
        component:() => import('../components/PageNotFound.vue')
    },
    
  ]
})

export default router