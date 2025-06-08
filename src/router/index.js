import { createRouter, createWebHistory } from 'vue-router';
import HomeB from '../components/MainPages/HomeBeforeLoginPage/HomeBeforeLoginPage.vue';
import Home from '../components/MainPages/HomeAfterLoginPage/HomeAfterLoginPage.vue';
import Check from '../components/MainPages/CheckHavePage/CheckHavePage.vue';
import AssistantSquareMain from '../components/MainPages/AssistantSquarePage/AssistantSquareMainPage.vue';
import AssistantSquareMainAssPage from '../components/MainPages/AssistantSquarePage/AssistantSquareMainAssPage.vue';
import AssistantSquareMainToolsPage from '../components/MainPages/AssistantSquarePage/AssistantSquareMainToolsPage.vue';
import AssistantDetails from '../components/PublicComponents/assistantDetails.vue';
import ToolDetails from '../components/PublicComponents/ToolDetails.vue';
import SetDetails from '../components/PublicComponents/SetDetails.vue';
import Purchase from '../components/MainPages/PurchasePage/PurchasePage.vue';
import Login from '../components/MainPages/LoginPage/LoginPage.vue';
import Register from '../components/MainPages/LoginPage/RegisterPage.vue';
import QuickCreate from '../components/MainPages/QuickCreateAssistantPage/QuickCreateAssistantPage.vue';
import SourceGoDown from '../components/MainPages/SourceGoDownPage/SourceGoDownPage.vue';
import ChatWithPeople from '../components/MainPages/ChatWithPeoplePage/ChatWithPeoplePage.vue';
import HelpWord from '../components/MainPages/HelpWordPage/HelpWordPage.vue';
import PersonalInfo from '../components/MainPages/PersonalPage/PersonalInfoPage.vue';
import PersonalStatistic from '../components/MainPages/PersonalPage/PersonalStatisticPage.vue';
import ManagerMainPage from '../components/ManagerPages/ManagerMainPage.vue';
import ServiceMainPage from '../components/ServicePages/ServiceMainPage.vue';
import { useAuthStore } from '../stores/authStore';
import { useAssistantStore } from '../stores/assistantStore';
import { storeToRefs } from 'pinia';

const router = createRouter({
  history: createWebHistory(),
  routes: [ 
    { path: '/', name: 'HomeB', component: HomeB },
    { path: '/home', name: 'Home', component: Home, meta: { requiresAuth: true, roles: ['NORMAL','VIP'] } },
    { path: '/check', name: 'Check', component: Check, meta: { requiresAuth: true, roles: ['NORMAL','VIP'] } },
    { path: '/assistantSquareMain', name: 'AssistantSquareMain', component: AssistantSquareMain, meta: { requiresAuth: true, roles: ['NORMAL','VIP'] } },
    { path: '/assistantSquareMainAssPage', name: 'AssistantSquareMainAssPage', component: AssistantSquareMainAssPage, meta: { requiresAuth: true, roles: ['NORMAL','VIP'] } },
    { path: '/assistantSquareMainToolsPage', name: 'AssistantSquareMainToolsPage', component: AssistantSquareMainToolsPage, meta: { requiresAuth: true, roles: ['NORMAL','VIP'] } },
    { path: '/assistant/:id', name: 'AssistantDetails', component: AssistantDetails, meta: { requiresAuth: true, roles: ['NORMAL','VIP'] }, props: true },
    { path: '/tool/:id', name: 'ToolDetails', component: ToolDetails, meta: { requiresAuth: true, roles: ['NORMAL','VIP'] }, props: true },
    { path: '/purchase', name: 'Purchase', component: Purchase, meta: { requiresAuth: true, roles: ['NORMAL','VIP'] } },
    { path: '/login', name: 'Login', component: Login },
    { path: '/register', name: 'Register', component: Register},
    { path: '/quickCreate', name: 'QuickCreate', component: QuickCreate, meta: { requiresAuth: true, roles: ['NORMAL','VIP'] } },
    { path: '/sourceGoDown', name: 'SourceGoDown', component: SourceGoDown, meta: { requiresAuth: true, roles: ['NORMAL','VIP'] } },
    { path: '/chatWithPeople', name: 'ChatWithPeople', component: ChatWithPeople, meta: { requiresAuth: true, roles: ['NORMAL','VIP'] } }, 
    { path: '/helpWord', name: 'HelpWord', component: HelpWord, meta: { requiresAuth: true, roles: ['NORMAL','VIP'] } },
    { path: '/personal/Info', name: 'PersonalInfo', component: PersonalInfo, meta: { requiresAuth: true, roles: ['NORMAL','VIP'] } },
    { path: '/personal/Statistic', name: 'PersonalStatistic', component: PersonalStatistic, meta: { requiresAuth: true, roles: ['NORMAL','VIP'] } },
    { path: '/manager', name: 'ManagerMainPage', component: ManagerMainPage, meta: { requiresAuth: true, roles: ['ADMIN'] } },
    { path: '/service', name: 'ServiceMainPage', component: ServiceMainPage, meta: { requiresAuth: true, roles: ['CS'] } },
    { path: '/settings/:id', name: 'SetDetails', component: SetDetails, meta: { requiresAuth: true, roles: ['NORMAL','VIP'] }, props: true },
  ],
});

// 使用导航守卫来检查登录状态和权限
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  const assistantStore = useAssistantStore()
  const { assistants } = storeToRefs(assistantStore)
  
  if(to.path === '/' || to.path === '/login' || to.path === '/login/SA' || to.path === '/register' || to.path === '/register/SA'){
    authStore.logout()
  }

  if(to.path === '/'){
    assistantStore.setCurrentAssistant(assistants.value[0])
  }

  if (to.meta.requiresAuth) {
    if (!authStore.isAuthenticated) {
      next('/login')
    } else if (to.meta.roles && !to.meta.roles.includes(authStore.user.role)) {
      // 根据用户角色重定向
      if (authStore.user.role === 'ADMIN') {
        next('/manager')
      } else if (authStore.user.role === 'CS') {
        next('/service')
      } else {
        next('/home')
      }
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router;
