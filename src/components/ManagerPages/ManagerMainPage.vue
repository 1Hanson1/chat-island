<template>
  <n-layout has-sider class="h-screen">
    <!-- Left Sider - Combined Selection and Conversations -->
  <n-layout-sider
    bordered
    :width="280"
    content-style="display: flex; flex-direction: column; padding-left: 16px;"
  >
      <n-tabs type="line" animated class="mb-4">
        <n-tab-pane name="users" tab="用户">
          <n-list class="mb-4">
            <n-list-item
              v-for="user in managerStore.users"
              :key="user.id"
              @click="managerStore.setCurrentSelection('user', user.id)"
              :class="{ 'bg-gray-100': managerStore.currentSelection.type === 'user' && managerStore.currentSelection.id === user.id }"
            >
              <n-thing :title="user.name" />
            </n-list-item>
          </n-list>
        </n-tab-pane>
        <n-tab-pane name="agents" tab="客服人员">
          <n-list class="mb-4">
            <n-list-item
              v-for="agent in managerStore.serviceAgents"
              :key="agent.id"
              @click="managerStore.setCurrentSelection('serviceAgent', agent.id)"
              :class="{ 'bg-gray-100': managerStore.currentSelection.type === 'serviceAgent' && managerStore.currentSelection.id === agent.id }"
            >
              <n-thing :title="agent.name" />
            </n-list-item>
          </n-list>
        </n-tab-pane>
      </n-tabs>

      <n-divider class="my-2" />

      <n-card title="对话记录" content-style="padding: 0;">
        <n-list>
          <n-list-item
            v-for="conversation in managerStore.getCurrentConversations"
            :key="conversation.id"
            @click="managerStore.setCurrentConversation(conversation.id)"
            :class="{ 'bg-blue-100': managerStore.currentConversation === conversation.id }"
          >
            <n-thing :title="conversation.title" />
          </n-list-item>
        </n-list>
      </n-card>

      <div class="mt-auto p-4">
        <n-button type="error" block @click="handleLogout">
          退出登录
        </n-button>
      </div>
    </n-layout-sider>

    <!-- Main Content Area -->
    <n-layout-content>
      <div class="flex h-full">
        <!-- 操作面板 -->
        <n-card title="操作面板" class="w-1/4 m-4" content-style="display: flex; flex-direction: column; gap-4;">
          <!-- 用户操作区 -->
          <n-card v-if="managerStore.currentSelection.type" :title="managerStore.currentSelection.type === 'user' ? '用户操作' : '客服操作'" size="small">
            <n-space vertical>
              <n-button type="primary" block @click="managerStore.editUser" >
                编辑{{managerStore.currentSelection.type === 'user' ? '用户' : '客服'}}
              </n-button>
              <n-button type="error" block @click="managerStore.currentSelection.type === 'user' ? managerStore.deleteUser() : managerStore.deleteServiceAgent()" >
                删除{{managerStore.currentSelection.type === 'user' ? '用户' : '客服'}}
              </n-button>
            </n-space>
          </n-card>
          
          <!-- 聊天记录操作区 -->
          <n-card v-if="managerStore.currentConversation" title="聊天记录操作" size="small">
            <n-space vertical>
              <n-button type="primary" block @click="managerStore.exportConversation">导出记录</n-button>
              <n-button type="error" block @click="managerStore.deleteConversation">删除记录</n-button>
            </n-space>
          </n-card>
        </n-card>

        <!-- 内容显示区 -->
        <n-card
          title="对话内容"
          class="flex-1 m-4"
          content-style="min-height: calc(100vh - 32px);"
        >
          <div v-if="managerStore.currentConversation" class="p-4">
            {{ managerStore.getCurrentConversationContent }}
          </div>
          <div v-else class="flex items-center justify-center h-full text-gray-400">
            请选择对话查看内容
          </div>
        </n-card>
      </div>
    </n-layout-content>
  </n-layout>
</template>

<script setup>
import { useManagerStore } from '../../stores/ManagerStore'
import { useAuthStore } from '../../stores/authStore'
import { useRouter } from 'vue-router'
import {
  NLayout,
  NLayoutSider,
  NLayoutContent,
  NTabs,
  NTabPane,
  NList,
  NListItem,
  NThing,
  NCard,
  NButton,
} from 'naive-ui'

const managerStore = useManagerStore()
const authStore = useAuthStore()
const router = useRouter()

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.n-layout-sider {
  transition: all 0.3s ease;
}

.n-button {
  border: 1px solid #d9d9d9;
  border-radius: 4px;
}
</style>
