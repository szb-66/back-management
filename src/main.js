import { createApp } from 'vue';
import router from './router/index.js';
import 'element-plus/dist/index.css';
import { store } from './vuex/ariticle.js';
import App from './App.vue';

const app = createApp(App)
app.use(router)
app.use(store);
app.mount('#app')
