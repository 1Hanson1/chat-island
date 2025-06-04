import { defineStore } from 'pinia'

export const useManagerStore = defineStore('manager', {
  state: () => ({
    users: [
      {
        id: 1,
        name: 'User 1',
        conversations: [
          { id: 1, title: 'Conversation with Model 1', content: 'Content 1' },
          { id: 2, title: 'Conversation with Model 2', content: 'Content 2' }
        ]
      }
    ],
    serviceAgents: [
      {
        id: 1,
        name: 'Agent 1',
        conversations: [
          { id: 1, title: 'Conversation with User 1', content: 'Content 1' },
          { id: 2, title: 'Conversation with User 2', content: 'Content 2' }
        ]
      }
    ],
    currentSelection: {
      type: null, // 'user' or 'serviceAgent'
      id: null
    },
    currentConversation: null
  }),
  getters: {
    getCurrentConversations(state) {
      if (!state.currentSelection.type) return []
      return state.currentSelection.type === 'user'
        ? state.users.find(u => u.id === state.currentSelection.id)?.conversations || []
        : state.serviceAgents.find(s => s.id === state.currentSelection.id)?.conversations || []
    },
    getCurrentConversationContent(state) {
      if (!state.currentConversation) return ''
      const conversations = this.getCurrentConversations
      return conversations.find(c => c.id === state.currentConversation)?.content || ''
    }
  },
  actions: {
    setCurrentSelection(type, id) {
      this.currentSelection = { type, id }
      this.currentConversation = null
    },
    setCurrentConversation(id) {
      this.currentConversation = id
    }
  }
})
