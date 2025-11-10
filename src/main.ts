import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'

import 'jquery'
import 'slick-carousel'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
// import 'bootstrap/dist/css/bootstrap.min.css'
// import 'bootstrap'

const app = createApp(App)
//創建 pinia
const pinia = createPinia()
//安裝 pinia
app.use(pinia)
app.use(router)
app.mount('#app')
