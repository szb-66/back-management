import { createApp } from 'vue';
import router from './router/index.js';
import 'element-plus/dist/index.css';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import './http/index.js';
import './style.css';
import { store } from './vuex/ariticle.js';
import App from './App.vue';

const app = createApp(App);
app.use(router);
app.use(store);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}
app.mount('#app');
