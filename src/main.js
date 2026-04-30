import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'

const pinia = createPinia()
const app = createApp(App)

// 必须先挂载 pinia，然后再渲染 App
app.use(pinia)
app.mount('#app')