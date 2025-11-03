import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/components/Index.vue')
  },
  {
    path: '/checkout',
    name: 'checkout',
    component: () => import('@/components/Checkout.vue')
  },
  {
    path: '/user',
    name: 'userData',
    component: () => import('@/components/userData.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router


