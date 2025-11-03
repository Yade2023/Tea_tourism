import { createApp } from 'vue'

import App from './App.vue'
// 引入pinia
import { createPinia } from 'pinia'
import router from './router'

// 引入 jQuery 和 slick-carousel
import 'jquery'
import 'slick-carousel'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

const app = createApp(App)
//創建 pinia
const pinia = createPinia()
//安裝 pinia
app.use(pinia)
app.use(router)
app.mount('#app')
