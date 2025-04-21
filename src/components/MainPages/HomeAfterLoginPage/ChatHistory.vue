<script setup>
import { storeToRefs } from 'pinia'
import { useAssistantStore } from '../../../stores/assistantStore'

const assistantStore = useAssistantStore()
const { currentAssistant } = storeToRefs(assistantStore)

function selectHistory(history) {
  assistantStore.setCurrentHistory(history.id)
}

function deleteHistory(historyId) {
  const index = currentAssistant.value.historys.findIndex(h => h.id === historyId)
    if (index !== -1) {
      currentAssistant.value.historys.splice(index, 1)
      // 如果删除的是当前选中的历史记录，重置选中状态
      if (assistantStore.currentHistoryID === historyId) {
        assistantStore.setCurrentHistory(null)
      }
    }
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
        <div class="flex items-center justify-between">
          <span class="list-content">{{ history.title }}</span>
          <button 
            class="text-red-500 hover:text-red-700 opacity-0 hover:opacity-100 transition-opacity duration-200"
            @click.stop="deleteHistory(history.id)"
          >
            删除
          </button>
        </div>
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
    