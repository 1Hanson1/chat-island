import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getCustomerInquiries, completeInquiry } from '../api/CS'

export const useServiceStore = defineStore('service', () => {
  // 加载状态
  const isLoading = ref(false)
  const error = ref(null)

  // 状态
  const userList = ref([])
  const currentUserId = ref(null)
  
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
  const messagesData = {}

  // 初始化数据
  async function initData() {
    try {
      isLoading.value = true
      
      const uid = localStorage.getItem('uid')
      const response = await getCustomerInquiries(uid)
      console.log(response)
      // 处理API返回数据
      const inquiries = response.data.data || []
      userList.value = inquiries.map(inquiry => ({
        id: inquiry.id,
        name: inquiry.userUid || `用户${inquiry.id}`,
        lastMessage: inquiry.messageContent || '新消息'
      }))      // 初始化消息数据
      inquiries.forEach(inquiry => {
        messagesData[inquiry.id] ={
          sender: 'user',
          content: inquiry.messageContent || '新消息',
        }
      })
      console.log(messagesData)
      // 设置默认当前用户
      if (inquiries.length > 0) {
        setCurrentUser(inquiries[0].id)
      }
    } catch (err) {
      error.value = err
    } finally {
      isLoading.value = false
    }
  }

  async function setCurrentUser(id) {
    currentUserId.value = id
    messages.value = []
    messages.value.push({
      sender: 'user',
      content: messagesData[id].content
    })
  }

  async function sendMessage(content) {
    try {
      isLoading.value = true
      const uid = localStorage.getItem('uid')
      await completeInquiry({
        csUid: uid,
        inquiryId: currentUserId.value,
        replyMsg: content
      })
      
      // 添加新消息到当前对话
      messages.value.push({
        sender: 'me',
        content: content
      })
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
    setCurrentUser,
    initData,
    sendMessage
  }
})
