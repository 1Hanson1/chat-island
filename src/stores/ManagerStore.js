import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { 
  getChatSessions,
  getChatSessionDetail,
  getUserKbs,
  getUserKbDocs,
  getAllUsers,
  getUserStatistics,
  createUserKb,
  uploadUserDoc,
  getUserById,
  getChatStats,
  updateUser,
  removeUserVip,
  renameChatSession,
  deleteChatSession,
  clearKbDocs,
  deleteUserKb,
  deleteUserDoc,
  deleteAllUserKbs
 } from '../api/admin'
import { stringify } from 'postcss'
import { getSessionChat } from '../api/chatAi'
import { deleteUser } from '../api/user'
import { createKnowledge, uploadDocument, listKnowledge, deleteAllKnowledge } from '../api/knowledge'

export const useManagerStore = defineStore('manager', () => {
  // 状态
  const users = ref([
    {
      uid: 1,
      name: '用户1',
      conversations: [
        { sessionId: 1, title: '与模型1的对话', content: [] },
        { sessionId: 2, title: '与模型2的对话', content: [] }
      ],
      knowledgeBases: [
        { kid: 1, title: '产品文档', files: [{
          docid: 1,
          name: '产品文档.pdf',
          content: 'https://www.example.com/product-doc.pdf'
        }] },
        { kid: 2, title: '使用指南', files: [] }
      ]
    }
  ])

  // API数据状态
  const apiData = ref(null)
  
  // 当前选择(id)
  const currentKnowledgeBase = ref(null)
  const currentSelection = ref(null)
  const currentConversation = ref(null)
  const currentFile = ref(null)

  const getCurrentConversations = computed(() => {
    if (!currentSelection.value) return []
    return users.value.find(u => u.uid === currentSelection.value)?.conversations || []
  })

  const getCurrentConversationContent = computed(() => {
    if (!currentConversation.value) return ''
    return getCurrentConversations.value.find(c => c.sessionId === currentConversation.value)?.content || ''
  })

  const getCurrentKnowledgeBases = computed(() => {
    if (!currentSelection.value) return []
    return users.value.find(u => u.uid === currentSelection.value)?.knowledgeBases || []
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
      
      // 合并普通用户和VIP用户数据
      const mergedUsers = responseN.data.users.concat(responseV.data.users).map(user => ({
        uid: user.uid,
        name: user.name,
        conversations: [],
        knowledgeBases: []
      }));
      users.value = mergedUsers;
      console.log('获取用户列表成功:', users.value)
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

  //选择当前用户,同时挂载聊天记录，知识库列表
  async function setCurrentSelection(uid) {
    currentSelection.value = uid
    currentConversation.value = null
    currentKnowledgeBase.value = null
    currentFile.value = null
    try{
      const rChat = await getChatSessions({ uid })
      const rKnowledge = await getUserKbs({ uid })
      console.log('选择用户挂载聊天记录:', rChat.data.data)
      console.log('选择用户挂载知识库列表:', rKnowledge.data.data)
      users.value.find(u => u.uid === uid).conversations = rChat.data.data.map(c => ({
        sessionId: c.memoryId,
        title: c.name,
        content: []
      }))
      // 转换API返回的knowledgeBases对象为数组格式
      users.value.find(u => u.uid === uid).knowledgeBases = Object.entries(rKnowledge.data.data.knowledgeBases).map(([kbId, kbData]) => ({
        kid: kbId, 
        title: `知识库${kbId}`,
        files: []
      }))
      console.log('选择用户挂载成功:', users.value)
    }
    catch(error){
      console.error('选择用户挂载失败:', error)
    }
  }
  //选择当前对话，同时挂载选择聊天记录具体内容
  async function setCurrentConversation(sessionid) {
    currentConversation.value = sessionid
    currentKnowledgeBase.value = null
    currentFile.value = null
    try{
      const rChat = await getSessionChat({ uid: currentSelection.value, sessionId: sessionid })
      console.log('选择对话挂载聊天记录:', rChat.data)
      if (rChat?.data) {
        users.value.find(u => u.uid === currentSelection.value).conversations.find(c => c.sessionId === sessionid).content = rChat.data.map(msg => {
          // 处理包含知识库和用户问题的消息
          let processedContent = msg.text || '';
          if (processedContent.includes('【知识库参考内容】') && processedContent.includes('【用户问题】')) {
            const userQuestionPart = processedContent.split('【用户问题】：')[1] || '';
            processedContent = userQuestionPart.split('\n')[0].trim();
          }
          
          return {
            id: msg.timestamp || Date.now(),
            talker: msg.type === 'AI' ? 'ai' : 'user',
            content: processedContent
          }
        })
      }
      console.log('选择对话挂载成功:', users.value)
    }
    catch(error){
      console.error('选择对话失败:', error)
    } 
  }

  // 设置当前知识库,同时挂载选择知识库具体文件列表
  async function setCurrentKnowledgeBase(kid) {
    currentKnowledgeBase.value = kid
    currentConversation.value = null
    currentFile.value = null
    try{
      const rKnowledge = await getUserKbDocs({ uid: currentSelection.value, kid: kid })
      console.log('选择知识库:', rKnowledge.data)
      users.value.find(u => u.uid === currentSelection.value).knowledgeBases.find(k => k.kid === kid).files = rKnowledge.data.data.documents.map(doc => ({
        docid: doc.docId,
        name: doc.originalFilename,
        content: []
      }))
      console.log('选择知识库挂载成功:', users.value)
    }
    catch(error){
      console.error('选择知识库失败:', error)
    }
  }

  // 设置当前文件
  async function setCurrentFile(docid) {
    console.log('设置当前文件:', docid)
    if (docid === null) {
      currentFile.value = null
    } else {
      currentFile.value = String(docid)
    }
  }


  //操作面板
  

  // 通用操作
  async function getSystemStatistics() {
    try {
      const response = await getUserStatistics()
      apiData.value = [{ title: '系统统计信息', content: response.data }]
      return response.data
    } catch (error) {
      console.error('获取系统统计信息失败:', error)
      throw error
    }
  }

  async function createNewKnowledgeBase(name = "1", tags = [], description = "") {
    // await createKnowledge({ name, tags, description, uid: "1" })
    const response = await listKnowledge({uid: "1"})
    console.log(response.data)
  }

  async function uploadNewDocument(file) {
    await uploadDocument({ kid: "kb_1", uid: "1", file })
  }

  async function deleteAllKnowledgeBases() {
    await clearKbDocs({ uid: "1", kid: "kb_1" })
  }

  // 用户管理操作
  async function getUserDetails() {
    if (!currentSelection.value) return
    try {
      clearSelection()
      const response = await getUserById({ uid: currentSelection.value })
      apiData.value = [{ title: '用户详细信息', content: response.data }]
      return response.data
    } catch (error) {
      console.error('获取用户详细信息失败:', error)
      throw error
    }
  }

  async function getUserChatStatistics() {
    if (!currentSelection.value) return
    try {
      clearSelection()
      const response = await getChatStats({ uid: currentSelection.value })
      apiData.value = [{ title: '用户聊天统计', content: response.data }]
      return response.data
    } catch (error) {
      console.error('获取用户聊天统计失败:', error)
      throw error
    }
  }

  async function downgradeUserToNormal() {
    if (!currentSelection.value) return
    try {
      const response = await removeUserVip({ toRemover: users.value.find(u => u.uid === currentSelection.value).name, reason: '降级为普通用户' })
      await getUsers() // 刷新用户列表
      return response.data
    } catch (error) {
      console.error('降级用户失败:', error)
      throw error
    }
  }

  async function deleteCurrentUser() {
    if (!currentSelection.value) return
    try {
      const response = await deleteUser({ name: users.value.find(u => u.uid === currentSelection.value).name })
      await getUsers() // 刷新用户列表
      clearSelection()
      return response.data
    } catch (error) {
      console.error('删除用户失败:', error)
      throw error
    }
  }

  // 聊天记录管理
  async function renameCurrentConversation(newName) {
    if (!currentSelection.value || !currentConversation.value) return
    try {
      const response = await renameChatSession({
        uid: currentSelection.value,
        sessionId: currentConversation.value,
        newName
      })
      await setCurrentSelection(currentSelection.value) // 刷新会话列表
      return response.data
    } catch (error) {
      console.error('重命名会话失败:', error)
      throw error
    }
  }

  async function deleteCurrentConversation() {
    if (!currentSelection.value || !currentConversation.value) return
    try {
      const response = await deleteChatSession({
        uid: currentSelection.value,
        sessionId: currentConversation.value
      })
      await setCurrentSelection(currentSelection.value) // 刷新会话列表
      clearSelection()
      return response.data
    } catch (error) {
      console.error('删除会话失败:', error)
      throw error
    }
  }

  // 知识库管理
  async function clearCurrentKnowledgeBase() {
    if (!currentSelection.value || !currentKnowledgeBase.value) return
    try {
      const response = await clearKbDocs({
        uid: currentSelection.value,
        kid: currentKnowledgeBase.value
      })
      await setCurrentKnowledgeBase(currentKnowledgeBase.value) // 刷新文件列表
      return response.data
    } catch (error) {
      console.error('清空知识库失败:', error)
      throw error
    }
  }

  async function deleteCurrentKnowledgeBase() {
    if (!currentSelection.value || !currentKnowledgeBase.value) return
    try {
      const response = await deleteUserKb({
        uid: currentSelection.value,
        kid: currentKnowledgeBase.value
      })
      await setCurrentSelection(currentSelection.value) // 刷新知识库列表
      clearSelection()
      return response.data
    } catch (error) {
      console.error('删除知识库失败:', error)
      throw error
    }
  }

  // 文件操作
  async function deleteCurrentFile() {
    if (!currentSelection.value || !currentFile.value) return
    try {
      const response = await deleteUserDoc({
        uid: currentSelection.value,
        docId: currentFile.value
      })
      await setCurrentKnowledgeBase(currentKnowledgeBase.value) // 刷新文件列表
      clearSelection()
      return response.data
    } catch (error) {
      console.error('删除文件失败:', error)
      throw error
    }
  }

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

    // 新增方法
    createNewKnowledgeBase,
    uploadNewDocument,
    deleteAllKnowledgeBases,
    getSystemStatistics,
    getUserDetails,
    getUserChatStatistics,
    downgradeUserToNormal,
    deleteCurrentUser,
    renameCurrentConversation,
    deleteCurrentConversation,
    clearCurrentKnowledgeBase,
    deleteCurrentKnowledgeBase,
    deleteCurrentFile
  }
})