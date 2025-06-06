<template>
  <n-config-provider :theme-overrides="themeOverrides">
    <div class="flex flex-col h-screen">
      <Header />
      <div class="flex flex-1">
        <LeftSmallList />
        <PersonalLeftList />
        <div id="sakana-widget" class="fixed bottom-4 right-4 z-50"></div>
        <div class="flex-1 p-8">
          <n-card title="个人信息" class="max-w-2xl mx-auto">
            <div class="grid grid-cols-2 gap-6">
              <div class="space-y-4">
                <div>
                  <h3 class="text-gray-500 text-sm font-medium">用户名</h3>
                  <p class="text-lg">{{ userInfo.username }}</p>
                </div>
                <div>
                  <h3 class="text-gray-500 text-sm font-medium">会员状态</h3>
                  <p class="text-lg">{{ userInfo.isMember }}</p>
                </div>
                <div>
                  <h3 class="text-gray-500 text-sm font-medium">注册时间</h3>
                  <p class="text-lg">{{ userInfo.registerDate }}</p>
                </div>
              </div>
              <div class="flex justify-center items-center">
                <img :src="userInfo.avatar" alt="" class="w-32 h-32 rounded-full" />
              </div>
            </div>
            
            <div class="mt-8 flex space-x-4">
              <n-button type="primary" @click="showEditModal = true">编辑信息</n-button>
              <n-button type="primary" @click="showPasswordModal = true">修改密码</n-button>
              <n-button type="error" @click="logout">
                退出登录
              </n-button>
              <n-button type="error" @click="showDeleteConfirm = true">
                注销账户
              </n-button>

              <!-- 注销确认模态框 -->
              <n-modal v-model:show="showDeleteConfirm">
                <n-card
                  style="width: 500px"
                  title="确认注销账户"
                  :bordered="false"
                  size="huge"
                  role="dialog"
                  aria-modal="true"
                >
                  <p>确定要永久删除您的账户吗？此操作不可撤销。</p>
                  <template #footer>
                    <div class="flex justify-end space-x-4">
                      <n-button @click="showDeleteConfirm = false">取消</n-button>
                      <n-button type="error" @click="deleteAccount">
                        确认注销
                      </n-button>
                    </div>
                  </template>
                </n-card>
              </n-modal>
            </div>
          </n-card>

          <!-- 编辑信息模态框 -->
          <n-modal v-model:show="showEditModal">
            <n-card
              style="width: 600px"
              title="编辑个人信息"
              :bordered="false"
              size="huge"
              role="dialog"
              aria-modal="true"
            >
              <n-form :model="editForm">
                <n-form-item label="用户名" path="username">
                  <n-input v-model:value="editForm.username" />
                </n-form-item>
              </n-form>
              <template #footer>
                <div class="flex justify-end space-x-4">
                  <n-button @click="showEditModal = false">取消</n-button>
                  <n-button type="primary" @click="handleSaveInfo">保存</n-button>
                </div>
              </template>
            </n-card>
          </n-modal>

          <!-- 修改密码模态框 -->
          <n-modal v-model:show="showPasswordModal">
            <n-card
              style="width: 600px"
              title="修改密码"
              :bordered="false"
              size="huge"
              role="dialog"
              aria-modal="true"
            >
              <n-form :model="passwordForm">
                <n-form-item label="旧密码" path="oldPassword">
                  <n-input
                    v-model:value="passwordForm.oldPassword"
                    type="password"
                    show-password-on="click"
                  />
                </n-form-item>
                <n-form-item label="新密码" path="newPassword">
                  <n-input
                    v-model:value="passwordForm.newPassword"
                    type="password"
                    show-password-on="click"
                  />
                </n-form-item>
                <n-form-item label="确认新密码" path="confirmPassword">
                  <n-input
                    v-model:value="passwordForm.confirmPassword"
                    type="password"
                    show-password-on="click"
                  />
                </n-form-item>
              </n-form>
              <template #footer>
                <div class="flex justify-end space-x-4">
                  <n-button @click="showPasswordModal = false">取消</n-button>
                  <n-button type="primary" @click="handleChangePassword">
                    确认修改
                  </n-button>
                </div>
              </template>
            </n-card>
          </n-modal>
        </div>
      </div>
    </div>
  </n-config-provider>
</template>

<script>
import Header from '../../PublicComponents/Header.vue';
import LeftSmallList from '../../PublicComponents/LeftSmallList.vue';
import { defineComponent, ref, onMounted} from 'vue';
import { useAuthStore } from '../../../stores/authStore';
import { updateUser, getUserInfo, deleteUser  } from '../../../api/user';
import PersonalLeftList from './PersonalLeftList.vue';
import { NConfigProvider } from 'naive-ui';
import {
  NCard,
  NAvatar,
  NButton,
  NModal,
  NForm,
  NInput,
  NFormItem
} from 'naive-ui';
import router from '../../../router';

import 'sakana-widget/lib/index.css';
import SakanaWidget from 'sakana-widget';

export default defineComponent({
  components: {
    Header,
    LeftSmallList,
    PersonalLeftList,
    NCard,
    NAvatar,
    NButton,
    NModal,
    NForm,
    NInput,
    NFormItem,
    NConfigProvider
  },
  setup() {
    onMounted(async () => {
      new SakanaWidget().mount('#sakana-widget');
      
      try {
        const response = await getUserInfo({ name: authStore.user.username });
        const userData = response.data.userInfo;
        
        userInfo.value = {
          username: userData.name,
          isMember: userData.category === 'VIP' ? 'VIP会员' : '普通用户',
          registerDate: new Date(userData.createTime).toLocaleDateString(),
          avatar: '/pics/avatar.png'
        };
      } catch (error) {
        console.error('Failed to fetch user info:', error);
      }
    });

    const authStore = useAuthStore();

    const userInfo = ref({
      username: '',
      isMember: '',
      registerDate: '',
      avatar: '/pics/avatar.png'
    });

    const editForm = ref({
      username: userInfo.value.username,
    });

    const passwordForm = ref({
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    });

    const showEditModal = ref(false);
    const showPasswordModal = ref(false);
    const showDeleteConfirm = ref(false);

    const handleSaveInfo = async () => {
      try {
        const userInfoR = await getUserInfo({
          name: authStore.user.username,
        });
        console.log('Get user info:', userInfoR);
        const response = await updateUser({
          uid: userInfoR.data.userInfo.uid,
          name: editForm.value.username,
          password: authStore.user.password,
          category: authStore.user.role
        });
        
        userInfo.value.username = editForm.value.username;
        
        console.log('Updated user info:', response);

        // Update authStore
        authStore.user.username = editForm.value.username;
        localStorage.setItem('user', JSON.stringify(authStore.user));
        
        showEditModal.value = false;
      } catch (error) {
        console.error('Failed to update user info:', error);
      }
    };

    const handleChangePassword = async () => {
      if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
        return;
      }

      try {
        const userInfoR = await getUserInfo({
          name: authStore.user.username,
        });

        const response = await updateUser({
          uid: userInfoR.data.userInfo.uid,
          name: userInfoR.data.userInfo.name,
          password: passwordForm.value.newPassword,
          category: authStore.user.role
        });

        // Update authStore password
        authStore.user.password = passwordForm.value.newPassword;
        localStorage.setItem('user', JSON.stringify(authStore.user));

        console.log('Updated user password:', response);

        // Reset form and close modal
        passwordForm.value = {
          oldPassword: '',
          newPassword: '',
          confirmPassword: ''
        };
        showPasswordModal.value = false;
      } catch (error) {
        console.error('Failed to change password:', error);
      }
    };

    const deleteAccount = async () => {
      try {
        await deleteUser({ name: authStore.user.username });
        authStore.logout();
        router.push('/login');
      } catch (error) {
        console.error('Failed to delete account:', error);
      }
    };

    const logout = () => {
      authStore.logout();
      router.push('/');
    };

    const themeOverrides = {
      common: {
        primaryColor: '#1e48f1', 
        primaryColorHover: '#1e48f1',
        primaryColorPressed: '#3D72D9',
      },
    };

    return {
      userInfo,
      editForm,
      passwordForm,
      showEditModal,
      showPasswordModal,
      showDeleteConfirm,
      handleSaveInfo,
      handleChangePassword,
      logout,
      deleteAccount,
      themeOverrides
    };
  }
});
</script>

<style scoped>
</style>
