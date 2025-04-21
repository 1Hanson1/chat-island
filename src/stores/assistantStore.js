import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAssistantStore = defineStore('assistant', () => {
  const assistants = ref([
    {
      id: 1,
      name: '写作助手',
      historys: [
        
      ],
    },
    {
      id: 2,
      name: '编程助手',
      historys: [
        // {
        //   id: 1,
        //   title: '欢迎使用编程助手',
        //   message: [{id: 1, talker: 'ai', content: '你好，我是编程助手，有什么可以帮助您？'}]
        // },
        // {
        //   id: 2,
        //   title: '欢迎使用编程助手',
        //   message: [{id: 1, talker: 'ai', content: '你好，我是编程助手，有什么可以帮助您？'}]
        // }
      ],
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
        else {
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
    createHistory,
    addHistory,
  }
})
