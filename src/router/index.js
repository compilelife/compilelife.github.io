import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
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
    {
      path: '/lattice',
      name: 'lattice',
      component: ()=>import('@/views/Lattice.vue')
    },
  ]
})

export default router
