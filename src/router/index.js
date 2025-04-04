import { createRouter, createWebHistory } from 'vue-router';
import HomeB from '../components/MainPages/HomeBeforeLoginPage/HomeBeforeLoginPage.vue';
import Home from '../components/MainPages/HomeAfterLoginPage/HomeAfterLoginPage.vue';
import Check from '../components/MainPages/CheckHavePage/CheckHavePage.vue';
import AssistantSquareMain from '../components/MainPages/AssistantSquarePage/AssistantSquareMainPage.vue';
import AssistantSquareMainAssPage from '../components/MainPages/AssistantSquarePage/AssistantSquareMainAssPage.vue';
import AssistantSquareMainToolsPage from '../components/MainPages/AssistantSquarePage/AssistantSquareMainToolsPage.vue';
import Purchase from '../components/MainPages/PurchasePage/PurchasePage.vue';
import Login from '../components/MainPages/LoginPage/LoginPage.vue';
import LoginSA from '../components/MainPages/LoginPage/LoginSAPage.vue';
import Register from '../components/MainPages/LoginPage/RegisterPage.vue';
import RegisterSA from '../components/MainPages/LoginPage/RegisterSAPage.vue';
import QuickCreate from '../components/MainPages/QuickCreateAssistantPage/QuickCreateAssistantPage.vue';
import SourceGoDown from '../components/MainPages/SourceGoDownPage/SourceGoDownPage.vue';
import ChatWithPeople from '../components/MainPages/ChatWithPeoplePage/ChatWithPeoplePage.vue';
import HelpWord from '../components/MainPages/HelpWordPage/HelpWordPage.vue';
import PersonalInfo from '../components/MainPages/PersonalPage/PersonalInfoPage.vue';
import PersonalStatistic from '../components/MainPages/PersonalPage/PersonalStatisticPage.vue';
import { useAuthStore } from '../stores/authStore';
import { useAssistantStore } from '../stores/assistantStore';

const router = createRouter({
  history: createWebHistory(),
  routes: [ 
    { path: '/', name: 'HomeB', component: HomeB },
    { path: '/home', name: 'Home', component: Home, meta: { requiresAuth: true } },
    { path: '/check', name: 'Check', component: Check, meta: { requiresAuth: true } },
    { path: '/assistantSquareMain', name: 'AssistantSquareMain', component: AssistantSquareMain, meta: { requiresAuth: true } },
    { path: '/assistantSquareMainAssPage', name: 'AssistantSquareMainAssPage', component: AssistantSquareMainAssPage, meta: { requiresAuth: true } },
    { path: '/assistantSquareMainToolsPage', name: 'AssistantSquareMainToolsPage', component: AssistantSquareMainToolsPage, meta: { requiresAuth: true } },
    { path: '/purchase', name: 'Purchase', component: Purchase, meta: { requiresAuth: true } },
    { path: '/login', name: 'Login', component: Login },
    { path: '/login/SA', name: 'LoginSA', component: LoginSA },
    { path: '/register', name: 'Register', component: Register},
    { path: '/register/SA', name: 'RegisterSA', component: RegisterSA},
    { path: '/quickCreate', name: 'QuickCreate', component: QuickCreate, meta: { requiresAuth: true } },
    { path: '/sourceGoDown', name: 'SourceGoDown', component: SourceGoDown, meta: { requiresAuth: true } },
    { path: '/chatWithPeople', name: 'ChatWithPeople', component: ChatWithPeople, meta: { requiresAuth: true } },
    { path: '/helpWord', name: 'HelpWord', component: HelpWord, meta: { requiresAuth: true } },
    { path: '/personal/Info', name: 'PersonalInfo', component: PersonalInfo, meta: { requiresAuth: true } },
    { path: '/personal/Statistic', name: 'PersonalStatistic', component: PersonalStatistic, meta: { requiresAuth: true } }
  ],
});

// 使用导航守卫来检查登录状态
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  const assistantStore = useAssistantStore()
  
  if(to.path === '/' || to.path === '/login'){
    authStore.logout()
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (authStore.isAuthenticated && to.meta.requiresAuth) {
    // if (assistantStore.assistants.length === 0) {
    //   await assistantStore.fetchAssistants()
    // }
    next()
  } else {
    next()
  }
})

// 提供一个方法来设置登录状态
export default router;
