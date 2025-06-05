import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useManagerStore = defineStore('manager', () => {
  // 状态
  const users = ref([
    {
      id: 1,
      name: '用户1',
      conversations: [
        { id: 1, title: '与模型1的对话', content: '内容1' },
        { id: 2, title: '与模型2的对话', content: '内容2' }
      ]
    }
  ])

  const serviceAgents = ref([
    {
      id: 1,
      name: '客服1',
      conversations: [
        { id: 1, title: '与用户1的对话', content: '内容1' },
        { id: 2, title: '与用户2的对话', content: '内容2' }
      ]
    }
  ])

  const currentSelection = ref({
    type: null, // 'user' or 'serviceAgent'
    id: null
  })

  const currentConversation = ref(null)

  // 计算属性
  const getCurrentConversations = computed(() => {
    if (!currentSelection.value.type) return []
    return currentSelection.value.type === 'user'
      ? users.value.find(u => u.id === currentSelection.value.id)?.conversations || []
      : serviceAgents.value.find(s => s.id === currentSelection.value.id)?.conversations || []
  })

  const getCurrentConversationContent = computed(() => {
    if (!currentConversation.value) return ''
    return getCurrentConversations.value.find(c => c.id === currentConversation.value)?.content || ''
  })

  // 方法
  function setCurrentSelection(type, id) {
    currentSelection.value = { type, id }
    currentConversation.value = null
  }

  function setCurrentConversation(id) {
    currentConversation.value = id
  }

  function editUser() {
    if (currentSelection.value.type === 'user') {
      const user = users.value.find(u => u.id === currentSelection.value.id)
      console.log('编辑用户:', user)
      // 这里添加实际编辑逻辑
    }
  }

  function deleteUser() {
    if (currentSelection.value.type === 'user') {
      users.value = users.value.filter(u => u.id !== currentSelection.value.id)
      currentSelection.value = { type: null, id: null }
    }
  }

  function deleteServiceAgent() {
    if (currentSelection.value.type === 'serviceAgent') {
      serviceAgents.value = serviceAgents.value.filter(s => s.id !== currentSelection.value.id)
      currentSelection.value = { type: null, id: null }
    }
  }

  function exportConversation() {
    if (currentConversation.value) {
      const conversation = getCurrentConversations.value.find(c => c.id === currentConversation.value)
      console.log('导出对话:', conversation)
      // 这里添加实际导出逻辑
    }
  }

  function deleteConversation() {
    if (currentConversation.value) {
      if (currentSelection.value.type === 'user') {
        const user = users.value.find(u => u.id === currentSelection.value.id)
        user.conversations = user.conversations.filter(c => c.id !== currentConversation.value)
      } else {
        const agent = serviceAgents.value.find(s => s.id === currentSelection.value.id)
        agent.conversations = agent.conversations.filter(c => c.id !== currentConversation.value)
      }
      currentConversation.value = null
    }
  }

  return {
    users,
    serviceAgents,
    currentSelection,
    currentConversation,
    getCurrentConversations,
    getCurrentConversationContent,
    setCurrentSelection,
    setCurrentConversation,
    editUser,
    deleteUser,
    deleteServiceAgent,
    exportConversation,
    deleteConversation
  }
})
