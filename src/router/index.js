import { createRouter, createWebHistory } from 'vue-router'
import HomeTea_tourism from '../components/HomeTea_tourism.vue'

// 定義路由
const routes = [
  { path: '/', component: HomeTea_tourism },
  { /*path: '/news', component: News */},
  {/* path: '/services', component: Services*/ },
  { /*path: '/teachers', component: Teachers*/ },
];

// 建立 Router 實例
const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
