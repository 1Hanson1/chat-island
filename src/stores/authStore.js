import { defineStore } from 'pinia'
import { ref } from 'vue'
import router from '../router'


export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref(localStorage.getItem('isAuthenticated') === 'true')
  const user = ref(JSON.parse(localStorage.getItem('user')) || null)
  
  function login(username, password) {
    isAuthenticated.value = true
    user.value = { username, password }
    localStorage.setItem('isAuthenticated', 'true')
    localStorage.setItem('user', JSON.stringify({ username, password }))
  }

  function loginSA(username, password, role) {
    isAuthenticated.value = true
    user.value = { username, password, role }
    localStorage.setItem('isAuthenticated', 'true')
    localStorage.setItem('user', JSON.stringify({ username, password, role }))
  }
  
  
  function register(username, password, role) {
    const userData = { username, password, role}
    isAuthenticated.value = true
    user.value = userData
    localStorage.setItem('isAuthenticated', 'true')
    localStorage.setItem('user', JSON.stringify(userData))
  }

  function registerSA(username, password, role, serialNumber) {
    const userData = { username, password, role, serialNumber}
    isAuthenticated.value = true
    user.value = userData
    localStorage.setItem('isAuthenticated', 'true')
    localStorage.setItem('user', JSON.stringify(userData))
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
    loginSA,
    logout,
    register,
    registerSA
    }
})

