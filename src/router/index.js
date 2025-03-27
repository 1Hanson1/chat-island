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
    { path: '/home', name: 'Home', component: Home },
    { path: '/check', name: 'Check', component: Check },
    { path: '/assistantSquare', name: 'AssistantSquare', component: AssistantSquare },
    { path: '/purchase', name: 'Purchase', component: Purchase },
    { path: '/login', name: 'Login', component: Login },
    { path: '/quickCreate', name: 'QuickCreate', component: QuickCreate },
    { path: '/sourceGoDown', name: 'SourceGoDown', component: SourceGoDown },
    { path: '/chatWithPeople', name: 'ChatWithPeople', component: ChatWithPeople },
    { path: '/helpWord', name: 'HelpWord', component: HelpWord },
    { path: '/personalPage', name: 'PersonalPage', component: PersonalPage }
  ],
});

export default router;
