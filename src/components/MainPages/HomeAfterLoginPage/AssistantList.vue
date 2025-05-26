<script setup>
import { NScrollbar} from 'naive-ui'
import { useAssistantStore } from '../../../stores/assistantStore'
import { storeToRefs } from 'pinia'
import router from '../../../router'

const assistantStore = useAssistantStore()
const { assistants, currentAssistant } = storeToRefs(assistantStore)

function selectAssistant(assistant) {
  assistantStore.setCurrentAssistant(assistant)
  const currentHistory = assistant.historys[0]
  if (currentHistory) {
    if(currentHistory.message.length > 0) {
      assistantStore.createHistory(assistant.id)
    }
    else {
      assistantStore.setCurrentHistory(currentHistory.id)
    }
  }
}

</script>

<template>
  <aside class="flex flex-col">
    <div class="h-15 flex items-center justify-center">
      <h2 class="list-title font-bold">助手列表</h2>
    </div>
    <hr>
    <div class="flex-1 overflow-y-auto">
      <n-scrollbar style="max-height: 740px" trigger="hover">
        <div 
          v-for="assistant in assistants" 
          :key="assistant.id"
          @click="selectAssistant(assistant)"
          class="p-4 hover:bg-gray-200 cursor-pointer flex justify-between items-center"
          :class="{ 'bg-gray-200': assistant.id === currentAssistant.id }"
        >
          <div class="list-content">{{ assistant.name }}</div>
        </div>
      </n-scrollbar>
    </div>
    <button @click="router.push('/assistantSquareMain')" class="m-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
      添加助手
    </button>
  </aside>
</template>

<style scoped>
.list-title {
  font-size: 1.3rem;
}
.list-content {
  font-size: 1.1rem;
}
</style>
  