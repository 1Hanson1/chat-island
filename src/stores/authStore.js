import { defineStore } from 'pinia'
import { ref } from 'vue'
import router from '../router'


export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref(localStorage.getItem('isAuthenticated') === 'true')
  const user = ref(JSON.parse(localStorage.getItem('user')) || null)
  
  function login(username) {
    isAuthenticated.value = true
    user.value = { username }
    localStorage.setItem('isAuthenticated', 'true')
    localStorage.setItem('user', JSON.stringify({ username }))
  }
  
  function logout() {
    isAuthenticated.value = false
    user.value = null
    localStorage.removeItem('isAuthenticated')
    localStorage.removeItem('user')
    
  }
  return {
    isAuthenticated,
    user,
    login,
    logout
    }
})

