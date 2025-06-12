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
  
  //更新数据
  async function getUsers() {
    try {
      const responseN = await getAllUsers({ category: 'NORMAL' })
      const responseV = await getAllUsers({ category: 'VIP' })
      const response = responseN.data.concat(responseV.data)
      console.log('获取用户列表成功:', response)
    } catch (error) {
      console.error('获取用户列表:', error)
    }
  }
  //选择方法

  //选择当前用户
  function setCurrentSelection(type, id) {
    currentSelection.value = { type, id }
    currentConversation.value = null
    currentKnowledgeBase.value = null
  }
  //选择当前对话
  function setCurrentConversation(id) {
    currentConversation.value = id
    currentKnowledgeBase.value = null
  }

  // 设置当前知识库
  function setCurrentKnowledgeBase(id) {
    currentKnowledgeBase.value = id
    currentConversation.value = null
  }


  //操作面板
  async function editUser() {
    try {
      const user = users.value.find(u => u.id === currentSelection.value.id)
      const response = await updateUser({ 
        username: user.name,
        name: user.name,
        category: user.category
      })
      console.log('用户信息更新成功:', response)
    } catch (error) {
      console.error('编辑用户失败:', error)
    }
  }

  async function updateUserPassword() {
    try {
      const user = users.value.find(u => u.id === currentSelection.value.id)
      const newPassword = prompt('请输入新密码')
      if (newPassword) {
        const response = await updateUser({
          username: user.name,
          password: newPassword
        })
        console.log('密码更新成功:', response)
      }
    } catch (error) {
      console.error('修改密码失败:', error)
    }
  }

  async function updateUserCategory() {
    try {
      const user = users.value.find(u => u.id === currentSelection.value.id)
      const newCategory = prompt('请输入新用户类别', user.category || 'NORMAL')
      if (newCategory) {
        const response = await updateUser({
          username: user.name,
          category: newCategory
        })
        user.category = newCategory
        console.log('用户类别更新成功:', response)
      }
    } catch (error) {
      console.error('变更用户类别失败:', error)
    }
  }

  async function deleteUser() {
    try {
      const user = users.value.find(u => u.id === currentSelection.value.id)
      if (confirm(`确定要删除用户 ${user.name} 吗？`)) {
        await deleteUser({ username: user.name })
        users.value = users.value.filter(u => u.id !== currentSelection.value.id)
        currentSelection.value = { type: null, id: null }
      }
    } catch (error) {
      console.error('删除用户失败:', error)
    }
  }

  async function exportConversation() {
    try {
      const user = users.value.find(u => u.id === currentSelection.value.id)
      const response = await exportConversation({
        uid: user.id,
        sessionId: currentConversation.value
      })
      console.log('导出成功:', response)
    } catch (error) {
      console.error('导出对话失败:', error)
    }
  }

  async function renameConversation() {
    try {
      const user = users.value.find(u => u.id === currentSelection.value.id)
      const newName = prompt('输入新的对话名称')
      if (newName) {
        const response = await renameChatSession({
          uid: user.id,
          sessionId: currentConversation.value,
          newName
        })
        const conversation = user.conversations.find(c => c.id === currentConversation.value)
        conversation.title = newName
        console.log('重命名成功:', response)
      }
    } catch (error) {
      console.error('重命名对话失败:', error)
    }
  }

  async function deleteConversation() {
    try {
      const user = users.value.find(u => u.id === currentSelection.value.id)
      if (confirm('确定要删除此对话吗？')) {
        await deleteChatSession({
          uid: user.id,
          sessionId: currentConversation.value
        })
        user.conversations = user.conversations.filter(c => c.id !== currentConversation.value)
        currentConversation.value = null
      }
    } catch (error) {
      console.error('删除对话失败:', error)
    }
  }

  async function clearEmptyConversations() {
    try {
      const user = users.value.find(u => u.id === currentSelection.value.id)
      if (confirm('确定要清空所有空对话吗？')) {
        await clearEmptyChatSessions({
          uid: user.id
        })
        user.conversations = user.conversations.filter(c => c.content)
      }
    } catch (error) {
      console.error('清空空对话失败:', error)
    }
  }

  async function uploadKbDoc() {
    try {
      const user = users.value.find(u => u.id === currentSelection.value.id)
      const kb = user.knowledgeBases.find(k => k.id === currentKnowledgeBase.value)
      const fileInput = document.createElement('input')
      fileInput.type = 'file'
      fileInput.onchange = async (e) => {
        const file = e.target.files[0]
        const response = await uploadUserDoc({
          uid: user.id,
          kid: kb.id,
          file
        })
        kb.content = response.data.content
        console.log('上传文档成功:', response)
      }
      fileInput.click()
    } catch (error) {
      console.error('上传文档失败:', error)
    }
  }

  async function createKb() {
    try {
      const user = users.value.find(u => u.id === currentSelection.value.id)
      const name = prompt('输入知识库名称')
      if (name) {
        const response = await createUserKb({
          uid: user.id,
          name
        })
        user.knowledgeBases.push({
          id: response.data.id,
          title: name,
          content: ''
        })
        console.log('创建知识库成功:', response)
      }
    } catch (error) {
      console.error('创建知识库失败:', error)
    }
  }

  async function deleteKbDoc() {
    try {
      const user = users.value.find(u => u.id === currentSelection.value.id)
      const kb = user.knowledgeBases.find(k => k.id === currentKnowledgeBase.value)
      if (confirm('确定要删除当前文档吗？')) {
        await deleteUserDoc({
          uid: user.id,
          docId: kb.id
        })
        kb.content = ''
      }
    } catch (error) {
      console.error('删除文档失败:', error)
    }
  }

  async function deleteKb() {
    try {
      const user = users.value.find(u => u.id === currentSelection.value.id)
      if (confirm('确定要删除当前知识库吗？')) {
        await deleteUserKb({
          uid: user.id,
          kid: currentKnowledgeBase.value
        })
        user.knowledgeBases = user.knowledgeBases.filter(k => k.id !== currentKnowledgeBase.value)
        currentKnowledgeBase.value = null
      }
    } catch (error) {
      console.error('删除知识库失败:', error)
    }
  }



  return {
    users,
    getUsers,
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
    clearEmptyConversations,
    updateUserPassword,
    updateUserCategory,
    renameConversation,
    uploadKbDoc,
    createKb,
    deleteKbDoc,
    deleteKb,
  }
})