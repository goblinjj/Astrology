import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Home from '../views/Home.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: '首页',
      component: Home
    },
    {
      path: '/pan',
      name: '排盘',
      component: () => import('../views/Pan.vue')
    }
  ]
})

export default router
