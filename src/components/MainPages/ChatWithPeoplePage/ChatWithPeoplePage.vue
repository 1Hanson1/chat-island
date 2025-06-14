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
const messagesHistory = ref({}) // 改为对象存储，key为对话ID

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
  // 根据对话key加载对应消息
  if (key === 'new') {
    messages.value = []
  } else {
    messages.value = messagesHistory.value[key] || []
  }
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
      const res = await getUserInquiries(localStorage.getItem('uid'))
      console.log('获取历史消息成功:', res.data.data)
      
      // 确保数据存在且是数组
      if (!res.data?.data || !Array.isArray(res.data.data)) {
        throw new Error('Invalid messages data format')
      }
      
      // 初始化messagesHistory
      messagesHistory.value = {}
      // 按对话分组消息
      res.data.data.forEach(msg => {
        const convKey = msg.id || `conv_${msg.inquiryId || Date.now()}`
        if (!messagesHistory.value[convKey]) {
          messagesHistory.value[convKey] = []
          // 添加对话到边栏，排除已存在的对话
          if (!conversations.value.some(c => c.key === convKey)) {
            conversations.value.push({
              label: `对话${Object.keys(messagesHistory.value).length}`,
              key: convKey
            })
          }
        }
        messagesHistory.value[convKey].push({
          type: msg.isFromUser ? 'sent' : 'received',
          content: msg.messageContent,
          time: msg.inquiryTime
        })
        try {
          const replyData = typeof msg.replyHistory === 'string' 
            ? JSON.parse(msg.replyHistory)
            : msg.replyHistory;
          messagesHistory.value[convKey].push({
            type: msg.isFromUser ? 'sent' : 'received',
            content: replyData[0]?.msg,
            time: msg.inquiryTime
          })
          if(replyData[1]){
            messagesHistory.value[convKey].push({
            type: msg.isFromUser ? 'sent' : 'received',
            content: replyData[1]?.msg,
            time: msg.inquiryTime
          })
          }
          
        } catch {
          // 忽略解析失败的消息
        }
      })
      
      console.log('历史消息:', messagesHistory.value)
      // 默认加载第一个对话
      if (Object.keys(messagesHistory.value).length > 0) {
        const firstKey = Object.keys(messagesHistory.value)[0]
        loadConversation(firstKey)
      }
    } catch (error) {
      console.error('获取消息失败:', error)
      messages.value = []
      messagesHistory.value = {}
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
    const now = new Date().toISOString()
    
    // 创建新消息对象
    const newMessage = {
      type: 'sent',
      content: messageInput.value,
      time: now
    }
    
    // 添加到当前显示的消息列表
    messages.value.push(newMessage)
    
    // 如果是新对话，先创建对话
    if (activeConversation.value === 'new') {
      addNewConversation()
      // 初始化新对话的消息历史
      messagesHistory.value[activeConversation.value] = [newMessage]
    } else {
      // 添加到当前对话的历史记录
      if (!messagesHistory.value[activeConversation.value]) {
        messagesHistory.value[activeConversation.value] = []
      }
      messagesHistory.value[activeConversation.value].push(newMessage)
    }
    
    console.log('发送消息:', messageInput.value)
    
    // 发送消息到服务器
    const res = await submitHelpMessage({ 
      uid, 
      msg: messageInput.value,
      conversationId: activeConversation.value === 'new' ? undefined : activeConversation.value
    })
    
    console.log('服务器响应:', res.data)
    messageInput.value = ''
    
  } catch (error) {
    console.error('发送消息失败:', error)
    // 回滚UI上的消息显示
    messages.value = messages.value.slice(0, -1)
    if (activeConversation.value !== 'new' && messagesHistory.value[activeConversation.value]) {
      messagesHistory.value[activeConversation.value] = messagesHistory.value[activeConversation.value].slice(0, -1)
    }
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
