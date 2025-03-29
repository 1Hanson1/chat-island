<script setup>
import { ref } from 'vue';

const messages = ref([
  { text: '你好！我是AI助手，有什么可以帮您的吗？', sender: 'ai' }
]);
const newMessage = ref('');

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
  <main class="flex-1 flex flex-col h-full">
    <h1 class="bg-blue-300 text-gray-800 p-4 text-xl font-bold">AI 对话助手</h1>
    <div class="chat-content flex-1 overflow-y-auto mb-4 space-y-4 p-4">
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
    
    <div class="flex gap-2 p-4">
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
