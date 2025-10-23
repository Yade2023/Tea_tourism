import { createRouter, createWebHistory } from 'vue-router'
import App from '../App.vue'
import Admin from '../admin.vue'
import Test from '../Test.vue'
import Auth from '../Auth.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: App
  },
  {
    path: '/admin',
    name: 'Admin',
    component: Admin
  },
  {
    path: '/auth',
    name: 'Auth',
    component: Auth
  },
  {
    path: '/test',
    name: 'Test',
    component: Test
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
