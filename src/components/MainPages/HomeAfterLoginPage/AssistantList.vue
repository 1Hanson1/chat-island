<script setup>
import { NCard, NList, NListItem, NThing } from 'naive-ui'
import { useAssistantStore } from '../../../stores/assistantStore'
import { storeToRefs } from 'pinia'

const assistantStore = useAssistantStore()
const { assistants, currentAssistant } = storeToRefs(assistantStore)

function selectAssistant(assistant) {
  assistantStore.setCurrentAssistant(assistant)
  assistantStore.createHistory(assistant.id)
}
</script>

<template>
  <aside class="flex flex-col">
    <div class="h-15 flex items-center justify-center">
      <h2 class="list-title font-bold">助手列表</h2>
    </div>
    <hr>
    <div class="flex-1 overflow-y-auto">
      <div 
        v-for="assistant in assistants" 
        :key="assistant.id"
        class="p-4 hover:bg-gray-200 cursor-pointer flex justify-between items-center"
        @click="selectAssistant(assistant)"
        :class="{ 'bg-gray-200': assistant.id === currentAssistant.id }"
      >
        <span class="list-content">{{ assistant.name }}</span>
        <div class="opacity-0 hover:opacity-100 transition-opacity duration-200">
          <button class="ml-2 text-gray-500 hover:text-gray-700">
            设置
          </button>
          <button class="ml-2 text-red-500 hover:text-red-700">
            删除
          </button>
        </div>
      </div>
    </div>
    <button class="m-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
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
  