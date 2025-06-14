<template>
  <n-config-provider :theme-overrides="{ common: { primaryColor: '#1d4ed8' } }">
  <div class="h-screen w-screen overflow-x-hidden flex bg-gray-50">
    <!-- Left Sider - Combined Selection and Conversations -->
    <aside
      class="w-[280px] border-r border-gray-200 flex flex-col px-4 bg-white shadow-sm"
    >
      <n-tabs type="line" animated class="mb-4">
        <n-tab-pane name="normalusers" tab="普通用户">
          <n-list class="mb-4">
            <n-list-item
              v-for="user in managerStore.users"
              :key="user.uid"
              @click="managerStore.setCurrentSelection(user.uid)"
              :class="{ 'bg-gray-100': managerStore.currentSelection === user.uid }"
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
              :key="conversation.sessionId"
              @click="managerStore.setCurrentConversation(conversation.sessionId)"
              :class="{ 'bg-blue-100': managerStore.currentConversation === conversation.sessionId }"
            >
              <n-thing :title="conversation.title" />
            </n-list-item>
          </n-list>
        </n-tab-pane>
        <n-tab-pane name="knowledge" tab="知识库">
          <n-tree
            block-line
            :data="knowledgeTreeData"
            :selected-keys="selectedKnowledgeKeys"
            @update:selected-keys="handleKnowledgeSelect"
          />
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
          title="内容"
          class="flex-1 m-4"
          content-style="min-height: calc(100vh - 32px);"
        >
          <div v-if="managerStore.currentKnowledgeBase" class="p-4">
            {{ managerStore.getCurrentKnowledgeBases.find(k => k.kid === managerStore.currentKnowledgeBase)?.files }}
          </div>
          <div v-else-if="managerStore.currentConversation" class="p-4">
            {{ managerStore.getCurrentConversations.find(c => c.sessionId === managerStore.currentConversation)?.content }}
          </div>
          <div v-else-if="managerStore.currentFile" class="p-4">
            {{ managerStore.getCurrentKnowledgeBases.find(k => k.kid === managerStore.currentKnowledgeBase)?.files.find(f => f.docid === managerStore.currentFile)?.content}}
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
        <!-- 通用操作区 -->
        <n-card title="通用操作" size="small">
          <n-space vertical>
            <n-button type="primary" block @click="managerStore.getSystemStatistics()">
              获取系统统计信息
            </n-button>
            <n-button type="primary" block @click="showUploadModal = true">
              上传文档
            </n-button>
            <n-button type="primary" block @click="managerStore.createNewKnowledgeBase()">
              创建ai客服文件库
            </n-button>
            <n-button type="primary" block @click="managerStore.deleteAllKnowledgeBases()">
              清空知识库
            </n-button>
          </n-space>
        </n-card>
        <!-- 用户操作区 -->
        <n-card v-if="managerStore.currentSelection" title="用户管理" size="small">
          <n-space vertical>
            <n-button type="primary" block @click="managerStore.getUserDetails()">
              获取用户详细信息
            </n-button>
            <n-button type="primary" block @click="managerStore.getUserChatStatistics()">
              获取聊天统计信息
            </n-button>
            <n-button type="warning" block @click="managerStore.downgradeUserToNormal()">
              强制降为普通用户
            </n-button>
            <n-button type="error" block @click="managerStore.deleteCurrentUser()">
              删除用户
            </n-button>
          </n-space>
        </n-card>
        
        <!-- 聊天记录操作区 -->
        <n-card v-if="managerStore.currentConversation" title="聊天记录管理" size="small">
          <n-space vertical>
            <n-button type="primary" block @click="showRenameModal = true">重命名</n-button>
            <n-button type="error" block @click="managerStore.deleteCurrentConversation()">删除记录</n-button>
          </n-space>
        </n-card>
        <!-- 知识库操作区 -->
        <n-card v-else-if="managerStore.currentKnowledgeBase" title="知识库管理" size="small">
          <n-space vertical>
            <n-button type="primary" block @click="managerStore.clearCurrentKnowledgeBase()">清空当前知识库</n-button>
            <n-button type="error" block @click="managerStore.deleteCurrentKnowledgeBase()">删除当前知识库</n-button>
          </n-space>
        </n-card>
        <!-- 文件操作 -->
        <n-card v-if="managerStore.currentFile" title="文件操作" size="small">
          <n-space vertical>
            <n-button type="error" block @click="managerStore.deleteCurrentFile()">删除文件</n-button>
          </n-space>
        </n-card>
      </n-card>
    </aside>

    <n-modal v-model:show="showRenameModal" preset="dialog" title="重命名聊天记录">
      <n-input 
        v-model:value="renameInput" 
        placeholder="请输入新的聊天记录名称" 
        @keyup.enter="handleRename"
      />
      <template #action>
        <n-button @click="handleRename" type="primary">确认</n-button>
      </template>
    </n-modal>

    <n-modal v-model:show="showUploadModal">
      <n-card
        style="width: 600px"
        title="上传文件"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
      >
        <n-upload
          multiple
          directory-dnd
          :max="5"
          @change="handleFileUpload"
        >
          <n-upload-dragger>
            <div style="margin-bottom: 12px">
              <n-icon size="48" :depth="3">
                <ArchiveOutline />
              </n-icon>
            </div>
            <n-text style="font-size: 16px">
              点击或者拖动文件到该区域来上传
            </n-text>
          </n-upload-dragger>
        </n-upload>
      </n-card>
    </n-modal>
  </div>
  </n-config-provider>
</template>

<script setup>
import { useManagerStore } from '../../stores/ManagerStore'
import { useAuthStore } from '../../stores/authStore'
import { useRouter } from 'vue-router'
import { ArchiveOutline } from '@vicons/ionicons5'
import {
  NTabs,
  NTabPane,
  NList,
  NListItem,
  NThing,
  NCard,
  NButton,
  NConfigProvider,
  NTree,
  NModal,
  NInput,
  NUpload,
  NUploadDragger,
  NIcon,
  NText
} from 'naive-ui'
import { onMounted, computed, ref } from 'vue'

const baseURL = 'http://47.117.136.45:8113'

const knowledgeTreeData = computed(() => {
  return managerStore.getCurrentKnowledgeBases.map(knowledge => ({
    key: `kb-${knowledge.kid}`,
    label: knowledge.title,
    type: 'knowledge',
    children: knowledge.files.map(file => ({
      key: `file-${file.docid}`,
      label: file.name,
      type: 'file'
    }))
  }))
})

const selectedKnowledgeKeys = computed(() => {
  if (!managerStore.currentKnowledgeBase) return []
  return [`kb-${managerStore.currentKnowledgeBase}`]
})


function handleKnowledgeSelect(keys) {
  if (keys.length === 0) {
    managerStore.currentFile = null
    managerStore.setCurrentKnowledgeBase(null)
    return
  }
  
  const key = keys[0]
  if (key.startsWith('kb-')) {
    const kid = key.split('-')[1]
    managerStore.currentFile = null
    managerStore.setCurrentKnowledgeBase(kid)
  } else if (key.startsWith('file-')) {
    const docid = key.split('-')[1] + '-' +key.split('-')[2] + '-' +key.split('-')[3] + '-' +key.split('-')[4] + '-' +key.split('-')[5]
    console.log(docid)
    managerStore.currentFile = docid
  }
}

const managerStore = useManagerStore()
const authStore = useAuthStore()
const router = useRouter()

const showRenameModal = ref(false)
const renameInput = ref('')

const handleRename = async () => {
  if (renameInput.value.trim()) {
    await managerStore.renameCurrentConversation(renameInput.value)
    showRenameModal.value = false
    renameInput.value = ''
  }
}

const showUploadModal = ref(false)

const handleFileUpload = async ({ fileList }) => {
  if (!fileList || fileList.length === 0) return
  if (!managerStore.currentKnowledgeBase) {
    return
  }

  try {
    for (const file of fileList) {
      await managerStore.uploadNewDocument(file.file)
      console.log("upload success")
    }
    showUploadModal.value = false
  } catch (error) {
    console.log("upload error")
  }
}

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
