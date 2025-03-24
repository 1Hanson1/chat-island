import { createRouter, createWebHistory } from 'vue-router';
import Home from '../components/MainPages/Home.vue';
import Check from '../components/MainPages/Check.vue';
import AssistantSquare from '../components/MainPages/AssistantSquare.vue';
import Purchase from '../components/MainPages/Purchase.vue';
import Login from '../components/MainPages/Login.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'Home', component: Home },
    { path: '/check', name: 'Check', component: Check },
    { path: '/assistantSquare', name: 'AssistantSquare', component: AssistantSquare },
    { path: '/purchase', name: 'Purchase', component: Purchase },
    { path: '/login', name: 'Login', component: Login },
  ],
});

export default router;
