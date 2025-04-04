import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAssistantStore = defineStore('assistant', () => {
  const assistants = ref([
    {
      id: 1,
      name: '写作助手',
      history: [
        {
          id: 1,
          message: '你好，我是写作助手，有什么可以帮助您？'
        }
      ],
    },
    {
      id: 2,
      name: '编程助手',
      history: [
        {
          id: 1,
          message: '你好，我是编程助手，有什么可以帮助您？'
        }
      ],
    },
    {
      id: 3,
      name: '学习助手',
      history: [
        {
          id: 1,
          message: '你好，我是学习助手，有什么可以帮助您？'
        }
      ],
    },
  ])
  
  const currentAssistant = ref(assistants.value[0] || null)

  function setCurrentAssistant(assistant) {
    currentAssistant.value = assistant
  }

  function addHistory(assistantId, content) {
    const assistant = assistants.value.find(a => a.id === assistantId)
    if (assistant) {
      assistant.history.push({
        id: assistant.history.length + 1,
        content
      })
    }
  }

  return {
    assistants,
    currentAssistant,
    setCurrentAssistant,
    addHistory,
  }
})
