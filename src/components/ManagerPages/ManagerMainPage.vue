<template>
  <n-config-provider :theme-overrides="{ common: { primaryColor: '#1d4ed8' } }">
  <div class="h-screen w-screen overflow-x-hidden flex bg-gray-50">
    <!-- Left Sider - Combined Selection and Conversations -->
    <aside
      class="w-[280px] border-r border-gray-200 flex flex-col px-4 bg-white shadow-sm"
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
      </n-tabs>

      <n-divider class="my-2" />

      <n-tabs type="line" animated>
        <n-tab-pane name="conversations" tab="对话记录">
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
        </n-tab-pane>
        <n-tab-pane name="knowledge" tab="知识库">
          <n-list>
            <n-list-item
              v-for="knowledge in managerStore.getCurrentKnowledgeBases"
              :key="knowledge.id"
              @click="managerStore.setCurrentKnowledgeBase(knowledge.id)"
              :class="{ 'bg-blue-100': managerStore.currentKnowledgeBase === knowledge.id }"
            >
              <n-thing :title="knowledge.title" />
            </n-list-item>
          </n-list>
        </n-tab-pane>
      </n-tabs>
      <div class="mt-auto p-4">
        <n-button type="error" block @click="handleLogout">
          退出登录
        </n-button>
      </div>
    </aside>

    <!-- Main Content Area -->
    <main class="flex-1 bg-white m-4 rounded-lg shadow-sm min-w-0">
      <div class="flex h-full">
        <!-- 内容显示区 -->
        <n-card
          title="对话内容"
          class="flex-1 m-4"
          content-style="min-height: calc(100vh - 32px);"
        >
          <div v-if="managerStore.currentKnowledgeBase" class="p-4">
            {{ managerStore.getCurrentKnowledgeBases.find(k => k.id === managerStore.currentKnowledgeBase)?.content }}
          </div>
          <div v-else-if="managerStore.currentConversation" class="p-4">
            {{ managerStore.getCurrentConversations.find(c => c.id === managerStore.currentConversation)?.content }}
          </div>
          <div v-else-if="managerStore.apiData" class="p-4 space-y-4">
            <n-card v-for="(data, index) in managerStore.apiData" :key="index" :title="data.title">
              <pre>{{ JSON.stringify(data.content, null, 2) }}</pre>
            </n-card>
          </div>
          <div v-else class="flex items-center justify-center h-full text-gray-400">
            请选择知识库或对话记录或等待API数据
          </div>
        </n-card>
      
      </div>
    </main>

    <!-- 右侧操作面板 -->
    <aside
      class="w-[280px] border-l border-gray-200 flex flex-col px-4 bg-white shadow-sm"
    >
      <!-- 操作面板区 -->
      <n-card title="操作面板" class="mx-4 my-4 w-full" content-style="display: flex; flex-direction: column; gap-6; padding: 0 1rem;">
        <!-- 用户操作区 -->
        <n-card v-if="managerStore.currentSelection.type" title="用户管理" size="small">
          <n-space vertical size="large">
            <n-button type="primary" block @click="managerStore.editUser">
              编辑用户信息
            </n-button>
            <n-button type="primary" block @click="managerStore.updateUserPassword">
              修改密码
            </n-button>
            <n-button type="warning" block @click="managerStore.updateUserCategory">
              变更用户类别
            </n-button>
            <n-button type="error" block @click="managerStore.deleteUser">
              删除用户
            </n-button>
          </n-space>
        </n-card>
        
        <!-- 聊天记录操作区 -->
        <n-card v-if="managerStore.currentConversation" title="聊天记录管理" size="small">
          <n-space vertical>
            <n-button type="primary" block @click="managerStore.exportConversation">导出记录</n-button>
            <n-button type="primary" block @click="managerStore.renameConversation">重命名</n-button>
            <n-button type="error" block @click="managerStore.deleteConversation">删除记录</n-button>
            <n-button type="error" block @click="managerStore.clearEmptyConversations">清空空会话</n-button>
          </n-space>
        </n-card>
        <n-card v-else-if="managerStore.currentKnowledgeBase" title="知识库管理" size="small">
          <n-space vertical>
            <n-button type="primary" block @click="managerStore.uploadKbDoc">上传文档</n-button>
            <n-button type="primary" block @click="managerStore.createKb">新建知识库</n-button>
            <n-button type="error" block @click="managerStore.deleteKbDoc">删除当前文档</n-button>
            <n-button type="error" block @click="managerStore.deleteKb">删除当前知识库</n-button>
          </n-space>
        </n-card>
      </n-card>
    </aside>
  </div>
  </n-config-provider>
</template>

<script setup>
import { useManagerStore } from '../../stores/ManagerStore'
import { useAuthStore } from '../../stores/authStore'
import { useRouter } from 'vue-router'
import {
  NTabs,
  NTabPane,
  NList,
  NListItem,
  NThing,
  NCard,
  NButton,
  NConfigProvider,
} from 'naive-ui'
import { onMounted } from 'vue'

const managerStore = useManagerStore()
const authStore = useAuthStore()
const router = useRouter()

onMounted(() => {
  managerStore.getUsers()
})

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
aside {
  transition: all 0.3s ease;
}

.n-button {
  border: 1px solid #d9d9d9;
  border-radius: 4px;
}
</style>
