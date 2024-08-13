import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/bezier',
      name: 'bezier',
      component: ()=>import('@/views/Bezier.vue')
    },
    {
      path: '/beziersf',
      name: 'beziersf',
      component: ()=>import('@/views/BezierSurface.vue')
    },
  ]
})

export default router
