import { defineStore } from 'pinia'
import { ref } from 'vue'
import { 
  createSession,
  chatWithKnowledge,
  deleteSession,
  getUserSessions
} from '../api/chatAi'
import { create } from 'naive-ui'



export const useAssistantStore = defineStore('assistant', () => {

  async function getAllSesseions() {
    const uid = localStorage.getItem('uid')
    const sessions = await getUserSessions(uid)
    console.log(sessions.data)
  }

  // API调用状态
  const isLoading = ref(false)
  const error = ref(null)
  const assistants = ref([
    {
      id: 0,
      name: '随便聊聊',
      description: '普通聊天助手',
      tags: ['聊天'],
      historys: [],
      inputFormat: '',
      outputFormat: '',
      contextLength: 3,
      presetPrompts: {
        systemPrompt: '你是一个友好的AI助手',
        contextExamples: [],
        conversationStarters: ['你好', '最近怎么样?']
      }
    },
    {
      id: 1,
      name: '写作助手',
      description: '帮助撰写各类文章',
      tags: ['写作'],
      historys: [],
      inputFormat: '',
      outputFormat: '',
      contextLength: 3,
      presetPrompts: {
        systemPrompt: '你是一个专业的写作助手',
        contextExamples: [],
        conversationStarters: ['帮我写一篇文章', '我需要写作帮助']
      }
    },
    {
      id: 2,
      name: '编程助手',
      description: '解答编程问题',
      tags: ['编程'],
      historys: [],
      inputFormat: '',
      outputFormat: '',
      contextLength: 3,
      presetPrompts: {
        systemPrompt: '你是一个专业的编程助手',
        contextExamples: [],
        conversationStarters: ['帮我解决这个编程问题', '解释这段代码']
      }
    },
  ])
  
  const currentAssistant = ref(assistants.value[0] || null)
  const currentHistoryID = ref(null)

  function setCurrentAssistant(assistant) {
    currentAssistant.value = assistant
  }

  function setCurrentHistory(historyId) {
    currentHistoryID.value = historyId
  }

  // 检查助手是否已存在
  function hasAssistant(assistantName) {
    return assistants.value.some(a => a.name === assistantName)
  }

  // 添加新助手
  function addAssistant(assistant) {
    if (!hasAssistant(assistant.name)) {
        const newAssistant = {
        id: assistant.id,
        name: assistant.name,
        description: assistant.description || '',
        tags: assistant.tags || [],
        historys: [],
        inputFormat: assistant.inputFormat || '',
        outputFormat: assistant.outputFormat || '',
        contextLength: assistant.contextLength || 3,
        presetPrompts: assistant.presetPrompts || {
          systemPrompt: '',
          contextExamples: [],
          conversationStarters: []
        }
      }
      assistants.value.push(newAssistant)
      return newAssistant
    }
    return null
  }

  // 创建历史记录
async function createHistory(assistantId){
    const assistant = assistants.value.find(a => a.id === assistantId)
    if (!assistant) return null
    try{
      const sessionId = await createSession()
      console.log('创建成功sessionId:', sessionId.data)
      if (!sessionId.data) return null

      const newHistory = {
        sessionId: sessionId.data,
        title: '新会话',
        message: []
      }
      assistant.historys.unshift(newHistory)
      setCurrentHistory(newHistory.sessionId) // 设置新创建的history为当前选中
      return newHistory
    }
    catch{
      console.log('create session failed')
      return null
    }
  }

  // 发送消息到API
  async function sendMessageToAPI(assistantId, message, kid, model) {
    try {
      isLoading.value = true
      error.value = null
      
      // 1. 添加用户消息
      addHistory(assistantId, 'user', message)

      console.log('sessionId:', currentHistoryID.value)
      console.log('msg:', message)
      console.log('kid:', kid)
      console.log('model:', model)
      // 2. 调用API
      const response = await chatWithKnowledge({
        sessionId: currentHistoryID.value?.toString() || '000001',
        msg: message,
        kid,
        model
      })
      
      // 3. 处理流式响应
      let aiResponse = ''
      for await (const chunk of response.data) {
        aiResponse += chunk
        // 更新最后一条AI消息
        updateLastAIMessage(assistantId, aiResponse)
      }
      // 替换data:并去除所有空白字符
      aiResponse = aiResponse.replaceAll('data:', '')
      aiResponse = aiResponse.replaceAll(/\s/g, '')
      // 4. 添加AI消息
      addHistory(assistantId, 'ai', aiResponse)
      
      // 5. 返回AI响应
      return aiResponse
    } catch (err) {
      error.value = err.message
      addHistory(assistantId, 'ai', '抱歉，发送消息时出错: ' + err.message)
      throw err
    } finally {
      isLoading.value = false
    }
  }
  
  // 更新最后一条AI消息
  function updateLastAIMessage(assistantId, content) {
    const assistant = assistants.value.find(a => a.id === assistantId)
    if (assistant) {
      const currentHistory = assistant.historys.find(h => h.id === currentHistoryID.value)
      if (currentHistory && currentHistory.message.length > 0) {
        const lastMessage = currentHistory.message[currentHistory.message.length - 1]
        if (lastMessage.talker === 'ai') {
          lastMessage.content = content
        }
      }
    }
  }

  // 添加历史记录
  async function addHistory(assistantId, talker, content) {
    const assistant = assistants.value.find(a => a.id === assistantId)
    if (assistant) {
      if (assistant.historys.length === 0) {
        console.log('create new history')
        const newHistory = await createHistory(assistantId)
        newHistory.message.push({id: 1, talker, content})
        console.log("111",assistant.historys)
      } 
      else {
        // 找到当前选中的history记录
        const currentHistory = assistant.historys.find(h => h.sessionId === currentHistoryID.value)
        if (currentHistory.message.length === 0){
          currentHistory.title = content.slice(0, 20) + (content.length > 20 ? '...' : '')
        }
        if (currentHistory) {
          currentHistory.message.push({
            id: currentHistory.message.length + 1,
            talker,
            content
          })
        }
      }
    }
  }

  // 删除助手
  function deleteAssistant(assistantId) {
    if (assistantId === 0) return false // 不允许删除"随便聊聊"助手
    
    const index = assistants.value.findIndex(a => a.id === assistantId)
    if (index !== -1) {
      assistants.value.splice(index, 1)
      // 如果删除的是当前选中的助手，则重置为第一个助手
      if (currentAssistant.value?.id === assistantId) {
        currentAssistant.value = assistants.value[0] || null
      }
      return true
    }
    return false
  }

  async function deleteSession(sessionId) {
    try{
      const response = await deleteSession(sessionId)
      console.log(response.data)
    }
    catch{
      console.log('delete session failed')
    }
  }
  return {
    assistants,
    currentAssistant,
    currentHistoryID,
    isLoading,
    error,
    setCurrentHistory,
    setCurrentAssistant,
    hasAssistant,
    addAssistant,
    createHistory,
    addHistory,
    sendMessageToAPI,
    deleteAssistant,
    getAllSesseions,
    deleteSession
  }
})
