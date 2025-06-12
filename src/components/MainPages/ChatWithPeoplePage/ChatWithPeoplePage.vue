<template>
  <NConfigProvider :theme-overrides="themeOverrides">
    <div class="flex flex-col h-screen bg-blue-50">
      <Header />
      <div class="flex flex-1 overflow-hidden">
        <LeftSmallList />
        <div class="w-64 border-r border-gray-200 bg-white flex flex-col">
          <div class="p-4 border-b border-gray-200">
            <h3 class="font-medium text-lg">对话记录</h3>
          </div>
          <div class="flex-1 overflow-y-auto">
            <NMenu
              :options="conversations"
              :value="activeConversation"
              @update:value="loadConversation"
            />
          </div>
        </div>
        <div class="flex-1 flex flex-col">
          <!-- 消息列表 -->
          <div class="message-list-container flex-1 overflow-y-auto p-4 space-y-4">
            <div
              v-for="(message, index) in messages"
              :key="index"
              class="max-w-3/4 rounded-lg p-3"
              :class="{
                'bg-blue-100 self-end': message.type === 'sent',
                'bg-white self-start': message.type === 'received'
              }"
            >
              {{ message.content }}
            </div>
          </div>
          
          <!-- 输入区域 -->
          <div class="p-4 border-t border-blue-200 bg-white">
            <div class="flex space-x-2">
              <NInput
                v-model:value="messageInput"
                type="textarea"
                placeholder="输入消息..."
                :autosize="{ minRows: 1, maxRows: 4 }"
                @keyup.enter="sendMessage"
              />
              <NButton type="primary" @click="sendMessage">
                <template #icon>
                  <NIcon>
                    <SendIcon />
                  </NIcon>
                </template>
              </NButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  </NConfigProvider>
</template>

<script setup>
import { ref, onMounted, h, onBeforeUnmount } from 'vue'
import { NConfigProvider, NInput, NButton, NIcon, NMenu } from 'naive-ui'
import { Send as SendIcon } from '@vicons/ionicons5'
import { submitHelpMessage, getUserInquiries } from '../../../api/CS.js'
import { Add as AddIcon } from '@vicons/ionicons5'
import Header from '../../PublicComponents/Header.vue'
import LeftSmallList from '../../PublicComponents/LeftSmallList.vue'

// 主题配置
const themeOverrides = {
  common: {
    primaryColor: '#3b82f6',
    primaryColorHover: '#2563eb',
    primaryColorPressed: '#1d4ed8'
  },
  Button: {
    colorPrimary: '#3b82f6',
    colorPrimaryHover: '#2563eb',
    colorPrimaryPressed: '#1d4ed8'
  }
}

// 消息数据
const messagesHistory = ref([])

// 中心
const messages = ref([])
const messageInput = ref('')

const loading = ref(false)

//边栏
const conversations = ref([
  {
    label: '新对话',
    key: 'new',
    icon: () => h(NIcon, null, { default: () => h(AddIcon) })
  },
])
const activeConversation = ref('new')

const loadConversation = (key) => {
  activeConversation.value = key
  // 这里添加加载对话的逻辑
}

const addNewConversation = () => {
  const newKey = `conv${Date.now()}`
  conversations.value.push({
    label: `对话${conversations.value.length}`,
    key: newKey
  })
  activeConversation.value = newKey
}

// 获取历史消息
const fetchMessages = async () => {
    try {
      loading.value = true
      messagesHistory = await getUserInquiries(localStorage.getItem('uid'))
      console.log('获取历史消息成功:', messagesHistory.data.data)
    } catch (error) {
      console.error('获取消息失败:', error)
      messages.value = []
    } finally {
      loading.value = false
    }
}

// 发送消息
const sendMessage = async () => {
  if (!messageInput.value.trim()) return
  
  try {
    loading.value = true
    const uid = localStorage.getItem('uid')
    
    const newMessage = {
      type: 'sent',
      content: messageInput.value,
      time: new Date().toISOString()
    }
    messages.value.push(newMessage)
    console.log('发送消息:', messageInput.value)
    
    // 发送消息到服务器
    const res = await submitHelpMessage({ uid, msg: messageInput.value })
    console.log(res.data)
    messageInput.value = ''
    if (activeConversation.value === 'new') {
      addNewConversation()
    }
  } catch (error) {
    console.error('发送消息失败:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchMessages()
})
</script>

<style scoped>
/* 自定义滚动条样式 */
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: #f1f1f1;
}
::-webkit-scrollbar-thumb {
  background: #3b82f6;
  border-radius: 3px;
}
</style>
