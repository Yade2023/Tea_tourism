import { createRouter, createWebHistory } from 'vue-router'
import HomeTea_tourism from '../components/HomeTea_tourism.vue'
import address from '../components/address.vue'


// 定義路由
const routes = [
  { path: '/', component: HomeTea_tourism },
  { /*path: '/News', component: News */},
  {/* path: '/services', component: Services*/ },
  { /*path: '/teachers', component: Teachers*/ },
  { path: '/address', component: address },
];

// 建立 Router 實例
const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
