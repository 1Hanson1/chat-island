import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useServiceStore = defineStore('service', () => {
  // 加载状态
  const isLoading = ref(false)
  const error = ref(null)

  // 状态
  const userList = ref([])
  
  const currentUserId = ref(null)
  const messages = ref([])
  
  const quickReplies = ref([])

  // 初始消息数据
  const messagesData = {
    1: [
      { sender: 'user', content: '你好，我有问题咨询' },
      { sender: 'me', content: '您好，请问有什么可以帮您？' }
    ],
    2: [
      { sender: 'user', content: '我想查询我的订单状态' },
      { sender: 'me', content: '请提供您的订单号' }
    ]
  }

  // 初始化数据
  async function initData() {
    try {
      isLoading.value = true
      // 模拟异步数据加载
      await new Promise(resolve => setTimeout(resolve, 500))
      
      userList.value = [
        { id: 1, name: '用户1', lastMessage: '你好，我有问题咨询' },
        { id: 2, name: '用户2', lastMessage: '订单查询' }
      ]
      currentUserId.value = 1
      messages.value = [...messagesData[1]]
      quickReplies.value = [
        {
          category: '问候语',
          replies: ['您好，请问有什么可以帮您？', '很高兴为您服务']
        },
        {
          category: '常见问题',
          replies: [
            '请提供您的订单号',
            '我们会尽快处理您的问题',
            '预计24小时内给您回复'
          ]
        }
      ]
    } catch (err) {
      error.value = err
    } finally {
      isLoading.value = false
    }
  }

  // 计算属性
  const currentUser = computed(() => {
    if (!currentUserId.value) return null
    return userList.value.find(user => user.id === currentUserId.value)
  })

  // 方法
  async function fetchUserMessages(userId) {
    try {
      isLoading.value = true
      // 模拟异步加载用户消息
      await new Promise(resolve => setTimeout(resolve, 300))
      
      // 返回预定义的消息数据
      return [...messagesData[userId] || []]
    } finally {
      isLoading.value = false
    }
  }

  async function setCurrentUser(id) {
    if (!id) return
    currentUserId.value = id
    messages.value = await fetchUserMessages(id)
  }

  function addMessage(message) {
    if (!message) return
    messages.value.push(message)
  }

  function sendMessage(content) {
    if (!content) return
    const message = {
      sender: 'me',
      content
    }
    addMessage(message)
    
    // 持久化消息到messagesData
    if (currentUserId.value && messagesData[currentUserId.value]) {
      messagesData[currentUserId.value].push(message)
    }
  }

  return {
    isLoading,
    error,
    userList,
    currentUserId,
    messages,
    quickReplies,
    currentUser,
    setCurrentUser,
    addMessage,
    sendMessage,
    initData
  }
})
