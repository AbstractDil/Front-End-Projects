import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'index',
      component: HomeView,
      meta : {title : "Home | Sagar Nandy | Welcome to NANDYSAGAR.IN"}
    },

    {
      path : '/home',
      name: 'home',
      component:() => import('../views/HomeView.vue'),
      meta : {title : "Home | Sagar Nandy | Welcome to NANDYSAGAR.IN"}

    },

    {
        path : '/about',
        name: 'about',
        component:() => import('../views/AboutView.vue'),
        meta : {title : " About Me | Sagar Nandy | Welcome to NANDYSAGAR.IN"}

    },


    {
      path : '/contact',
      name: 'contact',
      component:() => import('../views/ContactView.vue'),
      meta : {title : " Contact Me | Sagar Nandy | Welcome to NANDYSAGAR.IN"}

  },

    {
        path : '/:catchAll(.*)',
        name: 'PageNotFound',
        component:() => import('../components/PageNotFound.vue'),
        meta : {title : " 404 Page Not Found | Sagar Nandy | Welcome to NANDYSAGAR.IN"}


    },
    
  ]
})

router.beforeEach((to)=>{
document.title = to.meta.title;
})

export default router