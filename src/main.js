import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import 'vue-waterfall-plugin-next/dist/style.css'
import { i18n } from './locale/i18n'

import App from './App.vue'
import router from './router'

const app = createApp(App)

const language = navigator.language || navigator.userLanguage
if (language.startsWith('zh')) {
    i18n.global.locale = 'zh'
} else {
    i18n.global.locale = 'en'
}

app.use(createPinia())
  .use(router)
  .use(ElementPlus)
  .use(i18n)
  .mount('#app')
