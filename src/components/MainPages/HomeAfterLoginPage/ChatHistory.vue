<script setup>
import { storeToRefs } from 'pinia'
import { useAssistantStore } from '../../../stores/assistantStore'

const assistantStore = useAssistantStore()
const { currentAssistant } = storeToRefs(assistantStore)

function selectHistory(history) {
  console.log('Selecting history:', history.id)
  assistantStore.setCurrentHistory(history.id)
  console.log('Current history ID:', assistantStore.currentHistoryID)
}
</script>

<template>
  <aside class="flex flex-col">
    <div class="h-15 flex items-center justify-center">
      <h2 class="text-xl font-bold list-title">对话记录</h2>
    </div>
    <hr>
    <div v-if="currentAssistant" class="flex-1 overflow-y-auto">
      <div 
      v-for="history in currentAssistant.historys"
      :key="history.id"
      class="p-4 hover:bg-gray-200 cursor-pointer"
      @click="selectHistory(history)"
      :class="{ 'bg-gray-200': history.id === assistantStore.currentHistoryID }"
    >
        <span class="list-content">{{ history.title }}</span>
      </div>
    </div>
    <div v-else class="flex items-center justify-center h-full">
      <p>请从左侧选择助手</p>
    </div>
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
    