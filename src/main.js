import { createApp } from 'vue'
import './style.css'
import router from './router'
import AppRoot from './AppRoot.vue'

const app = createApp(AppRoot)

app.use(router)
app.mount('#app')
