import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import formatDate from './utils/formatDate';

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.config.globalProperties.$formatDate = formatDate;

app.use(createPinia())
app.use(router)

app.mount('#app')
