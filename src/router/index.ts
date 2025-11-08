import { createRouter, createWebHistory } from 'vue-router'
import HomeTea_tourism from '../components/HomeTea_tourism.vue'
import address from '../components/address.vue'
import knowledge from '../components/knowledge.vue'
import teaTourismArea from '../components/teaTourismArea.vue'
import login from '../components/login.vue'
import Shopping4 from '../components/Shopping4.vue'
import Checkout from '../components/Checkout.vue'
import userData from '../components/userData.vue'
import OrderCompleted from '../components/OrderCompleted.vue'

// 定義路由
const routes = [
  { path: '/', component: HomeTea_tourism },
  { path: '/knowledge', component: knowledge },
  { path: '/teaTourismArea', component: teaTourismArea },
  { path: '/Shopping4', component: Shopping4 },
  { path: '/address', component: address },
  { path: '/login', component: login },
  { path: '/store', component: Checkout },
  { path: '/user', component: userData },
  { path: '/order-completed', name: 'orderCompleted', component: OrderCompleted },
];

// 建立 Router 實例
const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
