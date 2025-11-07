import { createRouter, createWebHistory } from 'vue-router'
import HomeTea_tourism from '../components/HomeTea_tourism.vue'
import address from '../components/address.vue'
import knowledge from '../components/knowledge.vue'
import teaTourismArea from '../components/teaTourismArea.vue'
import login from '../components/login.vue'

// 定義路由
const routes = [
  { path: '/', component: HomeTea_tourism },
  { path: '/knowledge', component: knowledge },
  { path: '/teaTourismArea', component: teaTourismArea },
  { /*path: '/services', component: services*/ },
  { path: '/address', component: address },
  { path: '/login', component: login },

];

// 建立 Router 實例
const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
