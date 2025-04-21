<script setup>
import { ref, watch, computed } from 'vue';
import { storeToRefs } from 'pinia'
import { useAssistantStore } from '../../../stores/assistantStore'
import { Add } from '@vicons/ionicons5'
import { Icon } from '@vicons/utils'


const assistantStore = useAssistantStore()
const { currentAssistant, currentHistoryID} = storeToRefs(assistantStore)

const messages = computed(() => {
  const currentAssistant = assistantStore.currentAssistant
  const currentHistory = currentAssistant?.historys.find(
    h => h.id === assistantStore.currentHistoryID
  )
  return currentHistory?.message || []
})

const newMessage = ref('') //输入框内容


function sendMessage() {
  if (!newMessage.value.trim()) return;

  assistantStore.addHistory(
    currentAssistant.value.id,
    'user',
    newMessage.value
  );

  let mid = newMessage.value;
  newMessage.value = '';
  
  setTimeout(() => {
    const aiResponse = '收到你的消息: ' + mid;
    assistantStore.addHistory(
      currentAssistant.value.id,
      'ai',
      aiResponse
    );
  }, 500);
  
}

function createNewChat() {
  assistantStore.createHistory(currentAssistant.value.id)
  console.log(currentAssistant.value.historys[0])
}

</script>

<template>
  <main class="bg-gray-50 flex-1 flex flex-col h-full">
    <div class="flex items-center justify-between">
      <h1 class=" text-gray-800 m-4 text-xl font-bold">
      {{ currentAssistant?.name || 'AI 对话助手' }}
      </h1>
      <button 
        v-if="currentAssistant"
        @click="createNewChat"
        class="bg-blue-500 text-white p-2 m-2 flex items-center rounded-lg hover:bg-blue-600"
      >
        <Icon>
          <Add />
        </Icon>
      </button>
    </div>
    
    <hr>
    <div v-if="currentAssistant" class="chat-content flex-1 overflow-y-auto mb-4 space-y-4 p-4">
      <div 
        v-for="(message, index) in messages" 
        :key="index"
        :class="{
          'flex justify-end': message.talker === 'user',
          'flex justify-start': message.talker === 'ai'
        }"
      >
        <div 
          :class="{
            'bg-blue-500 text-white rounded-l-lg rounded-br-lg px-4 py-2 max-w-xs': message.talker === 'user',
            'bg-gray-200 rounded-r-lg rounded-bl-lg px-4 py-2 max-w-xs': message.talker === 'ai'
          }"
        >
          {{ message.content }}
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