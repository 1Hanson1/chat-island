import { defineStore } from 'pinia'
import { ref } from 'vue'
import router from '../router'


export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref(localStorage.getItem('isAuthenticated') === 'true')
  const user = ref(JSON.parse(localStorage.getItem('user')) || null)
  
  function changeIsAuthenticated(value) {
    isAuthenticated.value = value
  }

  function loginSA(username, password, role) {
    isAuthenticated.value = true
    user.value = { username, password, role }
    localStorage.setItem('isAuthenticated', 'true')
    localStorage.setItem('user', JSON.stringify({ username, password, role }))
  }
  
  function registerSA(username, password, role, serialNumber) {
    const userData = { username, password, role, serialNumber}
    isAuthenticated.value = true
    user.value = userData
    localStorage.setItem('user', JSON.stringify(userData))
  }

  function logout() {
    isAuthenticated.value = false
    localStorage.removeItem('isAuthenticated')
  }
  return {
    isAuthenticated,
    user,
    changeIsAuthenticated,
    loginSA,
    logout,
    registerSA
    }
})

