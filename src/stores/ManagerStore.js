import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { 
  getChatSessions,
  getChatSessionDetail,
  // 这里添加其他API导入
 } from '../api/admin'

export const useManagerStore = defineStore('manager', () => {
  // 状态
  const users = ref([
    {
      id: 1,
      name: '用户1',
      conversations: [
        { id: 1, title: '与模型1的对话', content: '内容1' },
        { id: 2, title: '与模型2的对话', content: '内容2' }
      ],
      knowledgeBases: [
        { id: 1, title: '产品文档', content: '文档内容1' },
        { id: 2, title: '使用指南', content: '文档内容2' }
      ]
    }
  ])

  // API数据状态
  const apiData = ref(null)
  
  // 当前选中的知识库
  const currentKnowledgeBase = ref(null)

  const currentSelection = ref({
    type: null, // 'user'
    id: null
  })

  const currentConversation = ref(null)

  const getCurrentConversations = computed(() => {
    if (!currentSelection.value.type) return []
    return users.value.find(u => u.id === currentSelection.value.id)?.conversations || []
  })

  const getCurrentConversationContent = computed(() => {
    if (!currentConversation.value) return ''
    return getCurrentConversations.value.find(c => c.id === currentConversation.value)?.content || ''
  })

  const getCurrentKnowledgeBases = computed(() => {
    if (!currentSelection.value.type) return []
    return users.value.find(u => u.id === currentSelection.value.id)?.knowledgeBases || []
  })
  
  //操作方法

  //选择当前用户
  function setCurrentSelection(type, id) {
    currentSelection.value = { type, id }
    currentConversation.value = null
  }
  //选择当前对话
  function setCurrentConversation(id) {
    currentConversation.value = id
  }

  // 设置当前知识库
  function setCurrentKnowledgeBase(id) {
    currentKnowledgeBase.value = id
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

  function exportConversation() {
    if (currentConversation.value) {
      const conversation = getCurrentConversations.value.find(c => c.id === currentConversation.value)
      console.log('导出对话:', conversation)
      // 这里添加实际导出逻辑
    }
  }

  function deleteConversation() {
    if (currentConversation.value && currentSelection.value.type === 'user') {
      const user = users.value.find(u => u.id === currentSelection.value.id)
      user.conversations = user.conversations.filter(c => c.id !== currentConversation.value)
      currentConversation.value = null
    }
  }



  return {
    users,
    apiData,
    currentSelection,
    currentConversation,
    currentKnowledgeBase,
    getCurrentConversations,
    getCurrentConversationContent,
    getCurrentKnowledgeBases,
    setCurrentSelection,
    setCurrentConversation,
    setCurrentKnowledgeBase,
    editUser,
    deleteUser,
    exportConversation,
    deleteConversation,
  }
})