import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { 
  getChatSessions,
  getAllUsers,
  getChatSessionDetail,
  // 这里添加其他API导入
 } from '../api/admin'
import { getSessionChat } from '../api/chatAi'

export const useManagerStore = defineStore('manager', () => {
  // 状态
  const users = ref([
    {
      uid: 1,
      name: '用户1',
      conversations: [
        { sessionId: 1, title: '与模型1的对话', content: '内容1' },
        { sessionId: 2, title: '与模型2的对话', content: '内容2' }
      ],
      knowledgeBases: [
        { kid: 1, title: '产品文档', files: [{
          docid: 1,
          name: '产品文档.pdf',
        }] },
        { kid: 2, title: '使用指南', files: [] }
      ]
    }
  ])

  // API数据状态
  const apiData = ref(null)
  
  // 当前选择(id)
  const currentKnowledgeBase = ref(null)
  const currentSelection = ref({
    type: null, // 'user'
    id: null
  })
  const currentConversation = ref(null)
  const currentFile = ref(null)

  const getCurrentConversations = computed(() => {
    if (!currentSelection.value.type) return []
    return users.value.find(u => u.uid === currentSelection.value.id)?.conversations || []
  })

  const getCurrentConversationContent = computed(() => {
    if (!currentConversation.value) return ''
    return getCurrentConversations.value.find(c => c.sessionId === currentConversation.value)?.content || ''
  })

  const getCurrentKnowledgeBases = computed(() => {
    if (!currentSelection.value.type) return []
    return users.value.find(u => u.uid === currentSelection.value.id)?.knowledgeBases || []
  })

  const getCurrentKnowledgeBaseFiles = computed(() => {
    if (!currentKnowledgeBase.value) return []
    return getCurrentKnowledgeBases.value.find(k => k.kid === currentKnowledgeBase.value)?.files || []
  })
  
  //更新数据
  async function getUsers() {
    try {
      const responseN = await getAllUsers({ category: 'NORMAL' })
      const responseV = await getAllUsers({ category: 'VIP' })
      console.log('获取用户列表成功:', responseN, responseV)
    } catch (error) {
      console.error('获取用户列表:', error)
    }
  }
  //选择方法

  //清空选择状态
  function clearSelection() {
    currentConversation.value = null
    currentKnowledgeBase.value = null
    currentFile.value = null
  }

  //选择当前用户
  function setCurrentSelection(type, id) {
    currentSelection.value = { type, id }
    currentConversation.value = null
    currentKnowledgeBase.value = null
    currentFile.value = null
  }
  //选择当前对话
  function setCurrentConversation(id) {
    currentConversation.value = id
    currentKnowledgeBase.value = null
    currentFile.value = null
  }

  // 设置当前知识库
  function setCurrentKnowledgeBase(id) {
    currentKnowledgeBase.value = id
    currentConversation.value = null
    currentFile.value = null
  }

  // 设置当前文件
  function setCurrentFile(docid) {
    if (docid === null) {
      currentFile.value = null
    } else {
      currentFile.value = String(docid)
    }
  }


  //操作面板
  
  return {
    users,
    getUsers,
    apiData,

    currentSelection,
    currentConversation,
    currentKnowledgeBase,
    currentFile,

    getCurrentConversations,
    getCurrentConversationContent,
    getCurrentKnowledgeBases,
    getCurrentKnowledgeBaseFiles,

    clearSelection,
    setCurrentSelection,
    setCurrentConversation,
    setCurrentKnowledgeBase,
    setCurrentFile,


  }
})