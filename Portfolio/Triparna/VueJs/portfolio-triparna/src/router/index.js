import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue';
import ContactView from '../views/ContactView.vue';
import EducationView from '../views/EducationView.vue';


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'default',
      component: HomeView,
      meta : {title : "Home - Triparna Sarkar"}
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView,
      meta : {title : "Home - Triparna Sarkar"}

    },
    {
      path: '/contact',
      name: 'contact',
      component: ContactView,
      meta : {title : " Contact - Triparna Sarkar"}

    },
    {
      path: '/education',
      name: 'education',
      component: EducationView,
      meta : {title : " Education - Triparna Sarkar"}

    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
      meta : {title : "About - Triparna Sarkar"}

    }
  ]
})

router.beforeEach((to)=>{
  document.title = to.meta.title;
  })

export default router
