<script setup>
import { storeToRefs } from 'pinia'
import { NScrollbar } from 'naive-ui'
import { useAssistantStore } from '../../../stores/assistantStore'

const assistantStore = useAssistantStore()
const { currentAssistant } = storeToRefs(assistantStore)

function selectHistory(history) {
  console.log('selectHistory:', history.sessionId)
  assistantStore.setCurrentHistory(history.sessionId)
}

async function deleteHistory(historyId) {
  await assistantStore.deleteSessionx(historyId)
}

</script>

<template>
  <aside class="flex flex-col">
    <div class="h-15 flex items-center justify-center">
      <h2 class="text-xl font-bold list-title">对话记录</h2>
    </div>
    <hr>
    <n-scrollbar style="max-height: 740px" trigger="hover">
      <div v-if="currentAssistant" class="flex-1 overflow-y-auto">
        <div 
          v-for="history in assistantStore.historys"
          :key="history.sessionId"
          class="p-4 hover:bg-gray-200 cursor-pointer"
          @click="selectHistory(history)"
          :class="{ 'bg-gray-200': history.sessionId === assistantStore.currentHistoryID }"
        >
          <div class="flex items-center justify-between">
            <span class="list-content">{{ history.title }}</span>
            <button 
              class="text-red-500 hover:text-red-700 opacity-0 hover:opacity-100 transition-opacity duration-200"
              @click.stop="deleteHistory(history.sessionId)"
            >
              删除
            </button>
          </div>
        </div>
      </div>
      <div v-else class="flex items-center justify-center h-full">
        <p>请从左侧选择助手</p>
      </div>
    </n-scrollbar>
    
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
    