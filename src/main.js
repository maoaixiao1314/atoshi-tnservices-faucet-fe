import { createApp } from 'vue'
import App from './App.vue'
import installElementPlus from './plugins/element'
import '@/utils/lib-flexible/flexible.js'
const app = createApp(App)
installElementPlus(app)
app.mount('#app')
