import { createRouter, createWebHistory } from 'vue-router'
import Travel from '../Travel.vue'
import Auth from '../Auth.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Travel
  },
  {
    path: '/travel',
    name: 'Travel',
    component: Travel
  },
  {
    path: '/auth',
    name: 'Auth',
    component: Auth
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
