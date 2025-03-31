import { createApp } from 'vue';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import App from './App.vue';
import './assets/main.css'
import Router from './router';

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);


const app = createApp(App);
app.use(Router);
app.use(pinia);
app.mount('#app');