import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getCustomerInquiries, completeInquiry } from '../api/CS'

export const useServiceStore = defineStore('service', () => {
  // 加载状态
  const isLoading = ref(false)
  const error = ref(null)

  // 状态
  const userList = ref([
    { id: 1, name: '用户1', lastMessage: '你好，我有问题咨询' },
    { id: 2, name: '用户2', lastMessage: '订单查询' }
  ])
  const currentUserId = ref(1)
  
  const messages = ref([])
  
  const quickReplies = ref([
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
  ])

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
      
      const uid = localStorage.getItem('uid')
      const response = await getCustomerInquiries(uid)

      console.log(response.data)
    } catch (err) {
      error.value = err
    } finally {
      isLoading.value = false
    }
  }

  

  return {
    isLoading,
    error,
    userList,
    currentUserId,
    messages,
    quickReplies,
    messagesData,
    initData
  }
})
