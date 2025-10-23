import { createRouter, createWebHistory } from 'vue-router'
import App from '../App.vue'
import Auth from '../Auth.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: App
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
