<script setup>
import { ref, watch } from 'vue';
import { storeToRefs } from 'pinia'
import { useAssistantStore } from '../../../stores/assistantStore'

const assistantStore = useAssistantStore()
const { currentAssistant } = storeToRefs(assistantStore)

const messages = ref([
  { text: `你好！我是${currentAssistant.value?.name || 'AI助手'}，有什么可以帮您的吗？`, sender: 'ai' }
])
const newMessage = ref('')

watch(currentAssistant, (newVal) => {
  if (newVal) {
    resetMessagesForAssistant(newVal)
  }
})

//重置
function resetMessagesForAssistant(assistant) {
  messages.value = [
    { text: `你好！我是${assistant.name}，有什么可以帮您的吗？`, sender: 'ai' }
  ]
}

function sendMessage() {
  if (!newMessage.value.trim()) return;
  
  messages.value.push({
    text: newMessage.value,
    sender: 'user'
  });
  
  newMessage.value = '';
  
  setTimeout(() => {
    messages.value.push({
      text: '收到你的消息: ' + messages.value[messages.value.length - 1].text,
      sender: 'ai'
    });
  }, 500);
}
</script>

<template>
  <main class="bg-gray-50 flex-1 flex flex-col h-full">
    <h1 class=" text-gray-800 p-4 text-xl font-bold">
      {{ currentAssistant?.name || 'AI 对话助手' }}
    </h1>
    <hr>
    <div v-if="currentAssistant" class="chat-content flex-1 overflow-y-auto mb-4 space-y-4 p-4">
      <div 
        v-for="(message, index) in messages" 
        :key="index"
        :class="{
          'flex justify-end': message.sender === 'user',
          'flex justify-start': message.sender === 'ai'
        }"
      >
        <div 
          :class="{
            'bg-blue-500 text-white rounded-l-lg rounded-br-lg px-4 py-2 max-w-xs': message.sender === 'user',
            'bg-gray-200 rounded-r-lg rounded-bl-lg px-4 py-2 max-w-xs': message.sender === 'ai'
          }"
        >
          {{ message.text }}
        </div>
      </div>
    </div>
    <div v-else class="flex items-center justify-center h-full">
      <p>请从左侧选择助手</p>
    </div>
    
    <div v-if="currentAssistant" class="flex gap-2 p-4">
      <input
        v-model="newMessage"
        @keyup.enter="sendMessage"
        placeholder="输入消息..."
        class="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        @click="sendMessage"
        class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
      >
        发送
      </button>
    </div>
  </main>
</template>

<style scoped>
.chat-content {
  font-size: 1rem;
}
</style>