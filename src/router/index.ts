import { createRouter, createWebHistory } from 'vue-router'
import HomeTea_tourism from '../components/HomeTea_tourism.vue'
import address from '../components/address.vue'
import knowledge from '../components/knowledge.vue'
import Travel from '../components/Travel.vue'
import login from '../components/login.vue'
import Shopping4 from '../components/Shopping4.vue'
import Checkout from '../components/Checkout.vue'
import userData from '../components/userData.vue'
import OrderCompleted from '../components/OrderCompleted.vue'

// 定義路由
const routes = [
  { path: '/', component: HomeTea_tourism },
  { path: '/knowledge', component: knowledge },
  { path: '/Travel', component: Travel },
  { path: '/Shopping4', name: 'Shopping4', component: Shopping4 },
  { path: '/address', component: address },
  { path: '/login', component: login },
  { path: '/store', component: Checkout },
  { path: '/user', component: userData },
  { path: '/order-completed', name: 'orderCompleted', component: OrderCompleted },
];

// 建立 Router 實例
const router = createRouter({
  history: createWebHistory(),
  routes,
  // 路由跳轉時自動滾動到頂部
  scrollBehavior(to, from, savedPosition) {
    // 如果有保存的位置（例如瀏覽器前進/後退），則回到該位置
    if (savedPosition) {
      return savedPosition
    }
    // 否則滾動到頂部
    return { top: 0, behavior: 'smooth' }
  }
})

export default router
