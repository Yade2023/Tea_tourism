import { createRouter, createWebHistory } from 'vue-router'
import HelloTea_tourism from '../components/HelloTea_tourism.vue'

// 定義路由
const routes = [
  { path: '/', component: HelloTea_tourism },
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
