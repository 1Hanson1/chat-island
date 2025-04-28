<script setup>
import { storeToRefs } from 'pinia'
import { NScrollbar } from 'naive-ui'
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
        if(currentAssistant.value.historys.length === 0){
          assistantStore.createHistory(currentAssistant.value.id)
        }
        else{
          if(currentAssistant.value.historys[0].message.length === 0){
            assistantStore.setCurrentHistory(currentAssistant.value.historys[1].id)
          }
          else{
            assistantStore.createHistory(currentAssistant.value.id)
          }
        }
        
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
    <n-scrollbar style="max-height: 740px" trigger="hover">
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
    