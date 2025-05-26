import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAssistantStore = defineStore('assistant', () => {
  const assistants = ref([
    {
      id: 0,
      name: '随便聊聊',
      description: '普通聊天助手',
      tags: ['聊天'],
      historys: [],
    },
    {
      id: 1,
      name: '写作助手',
      description: '帮助撰写各类文章',
      tags: ['写作'],
      historys: [],
    },
    {
      id: 2,
      name: '编程助手',
      description: '解答编程问题',
      tags: ['编程'],
      historys: [],
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
        id: Date.now(),
        name: assistant.name,
        description: assistant.description || '',
        tags: assistant.tags || [],
        historys: []
      }
      assistants.value.push(newAssistant)
      return newAssistant
    }
    return null
  }

  // 创建历史记录
  function createHistory(assistantId){
    const assistant = assistants.value.find(a => a.id === assistantId)
    if (assistant) {
      const newHistory = {
        id: Date.now(), // 使用时间戳作为唯一ID
        title: '新会话',
        message: []
      }
      assistant.historys.unshift(newHistory)
      setCurrentHistory(newHistory.id) // 设置新创建的history为当前选中
    }
    return null
  }

  // 添加历史记录
  function addHistory(assistantId, talker, content) {
    const assistant = assistants.value.find(a => a.id === assistantId)
    if (assistant) {
      // 仅处理助手的第一个历史记录
      if (assistant.historys.length === 0) {
        const newHistory = {
          id: Date.now(), // 使用时间戳作为唯一ID
          title: content.slice(0, 20) + (content.length > 20 ? '...' : ''),
          message: [{id: 1, talker, content}]
        }
        assistant.historys.push(newHistory)
        setCurrentHistory(newHistory.id) // 设置新创建的history为当前选中
      } 
      else {
        // 找到当前选中的history记录
        const currentHistory = assistant.historys.find(h => h.id === currentHistoryID.value)
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

  return {
    assistants,
    currentAssistant,
    currentHistoryID,
    setCurrentHistory,
    setCurrentAssistant,
    hasAssistant,
    addAssistant,
    createHistory,
    addHistory,
  }
})
