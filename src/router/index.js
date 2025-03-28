import { createRouter, createWebHistory } from 'vue-router';
import HomeB from '../components/MainPages/HomeBeforeLoginPage/HomeBeforeLoginPage.vue';
import Home from '../components/MainPages/HomeAfterLoginPage/HomeAfterLoginPage.vue';
import Check from '../components/MainPages/CheckHavePage/CheckHavePage.vue';
import AssistantSquare from '../components/MainPages/AssistantSquarePage/AssistantSquarePage.vue';
import Purchase from '../components/MainPages/PurchasePage/PurchasePage.vue';
import Login from '../components/MainPages/LoginPage/LoginPage.vue';
import QuickCreate from '../components/MainPages/QuickCreateAssistantPage/QuickCreateAssistantPage.vue';
import SourceGoDown from '../components/MainPages/SourceGoDownPage/SourceGoDownPage.vue';
import ChatWithPeople from '../components/MainPages/ChatWithPeoplePage/ChatWithPeoplePage.vue';
import HelpWord from '../components/MainPages/HelpWordPage/HelpWordPage.vue';
import PersonalPage from '../components/MainPages/PersonalPage/PersonalPage.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'HomeB', component: HomeB },
    { path: '/home', name: 'Home', component: Home, meta: { requiresAuth: true } },
    { path: '/check', name: 'Check', component: Check, meta: { requiresAuth: true } },
    { path: '/assistantSquare', name: 'AssistantSquare', component: AssistantSquare, meta: { requiresAuth: true } },
    { path: '/purchase', name: 'Purchase', component: Purchase, meta: { requiresAuth: true } },
    { path: '/login', name: 'Login', component: Login },
    { path: '/quickCreate', name: 'QuickCreate', component: QuickCreate, meta: { requiresAuth: true } },
    { path: '/sourceGoDown', name: 'SourceGoDown', component: SourceGoDown, meta: { requiresAuth: true } },
    { path: '/chatWithPeople', name: 'ChatWithPeople', component: ChatWithPeople, meta: { requiresAuth: true } },
    { path: '/helpWord', name: 'HelpWord', component: HelpWord, meta: { requiresAuth: true } },
    { path: '/personalPage', name: 'PersonalPage', component: PersonalPage, meta: { requiresAuth: true } }
  ],
});

// 使用导航守卫来检查登录状态
let isAuthenticated = false;
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isAuthenticated) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      });
    } else {
      next();
    }
  } else {
    next();
  }
});

// 提供一个方法来设置登录状态
export function setAuthenticated(value) {
  isAuthenticated = value;
}

export default router;
