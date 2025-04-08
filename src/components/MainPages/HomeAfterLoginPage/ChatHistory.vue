<script setup>
import { ref, watch } from "vue";
import { storeToRefs } from 'pinia'
import { useAssistantStore } from '../../../stores/assistantStore'

const assistantStore = useAssistantStore()
const { currentAssistant } = storeToRefs(assistantStore)
</script>

<template>
  <aside class="w-80 bg-gray-300 flex flex-col">
    <div class="bg-blue-200 h-15 flex items-center justify-center">
      <h2 class="text-xl font-bold list-title">对话记录</h2>
    </div>
    <div v-if="currentAssistant" class="flex-1 overflow-y-auto">
      <div 
        v-for="item in currentAssistant.history" 
        :key="item.id" 
        class="p-4 hover:bg-gray-200 list-content"
      >
        {{ item.title }}
      </div>
    </div>
    <div v-else class="flex items-center justify-center h-full">
      <p>请从左侧选择助手</p>
    </div>
  </aside>
</template>
    
  <script>
  export default {
    name: "ChatHistory",
  };
  </script>
  
<style scoped>
.list-title {
  font-size: 1.5rem;
}
.list-content {
  font-size: 1.2rem;
}
</style>
    