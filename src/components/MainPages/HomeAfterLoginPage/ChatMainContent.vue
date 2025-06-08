<script setup>
import { ref, watch, computed } from 'vue';
import { storeToRefs } from 'pinia'
import { useAssistantStore } from '../../../stores/assistantStore'
import { useRouter } from 'vue-router'
import { useSourceGoDownStore } from '../../../stores/sourceGoDown';
import { Add } from '@vicons/ionicons5'
import { IosSettings } from '@vicons/ionicons4'
import { DeleteRound } from '@vicons/material'
import { Icon } from '@vicons/utils'
import { NSelect } from 'naive-ui'

const router = useRouter()
const sourceGoDownStore = useSourceGoDownStore()
const { knowledgeBases, selectedKnowledgeBaseId } = storeToRefs(sourceGoDownStore)
const modelOptions = [
  { label: 'GPT-3.5', value: 'gpt-3.5' },
  { label: 'GPT-4', value: 'gpt-4' },
  { label: 'qwen-turbo', value: 'qwen-turbo' }
]
const selectedModel = ref('qwen-turbo')
const assistantStore = useAssistantStore()
const { currentAssistant, currentHistoryID } = storeToRefs(assistantStore)
const { deleteAssistant: deleteAssistantStore } = assistantStore

const messages = computed(() => {
  const currentAssistant = assistantStore.currentAssistant
  const currentHistory = currentAssistant?.historys.find(
    h => h.id === assistantStore.currentHistoryID
  )
  return currentHistory?.message || []
})

const newMessage = ref('') //输入框内容

async function sendMessage() {
  if (!newMessage.value.trim()) return;

  const message = newMessage.value;
  newMessage.value = '';
  const kid = sourceGoDownStore.selectedKnowledgeBaseId
  try {
    await assistantStore.sendMessageToAPI(
      currentAssistant.value.id,
      message,
      kid,
      modelOptions.find(m => m.value === selectedModel.value).value
    );
  } catch (err) {
    console.error('发送消息失败:', err);
  }
}

function createNewChat() {
  const currentHistory = currentAssistant.value.historys[0]
  if (currentHistory) {
    if(currentHistory.message.length > 0) {
      assistantStore.createHistory(currentAssistant.value.id)
    }
    else{
      assistantStore.setCurrentHistory(currentAssistant.value.historys[0].id)
    }
  }
}

function setAssistant() {
  if (currentAssistant.value && currentAssistant.value.id !== 0) {
    router.push(`/settings/${currentAssistant.value.id}`)
  }
}

function deleteAssistant() {
  if (currentAssistant.value && currentAssistant.value.id !== 0) {
    if (confirm(`确定要删除助手 "${currentAssistant.value.name}" 吗？`)) {
      deleteAssistantStore(currentAssistant.value.id)
    }
  }
  
}

</script>

<template>
  <main class="bg-gray-50 flex-1 flex flex-col h-full">
    <div class="flex items-center justify-between">
      <h1 class=" text-gray-800 m-4 text-xl font-bold">
      {{ currentAssistant?.name || 'AI 对话助手' }}
      </h1>
      <div class="flex">
        <button 
          v-if="currentAssistant"
          @click="createNewChat"
          class="flex items-center justify-center bg-blue-500 text-white p-2 m-2 rounded-lg hover:bg-green-600"
        >
          <Icon size="20">
            <Add />
          </Icon>
        </button>
        <button 
          v-if="currentAssistant"
          @click="setAssistant"
          class="flex items-center justify-center bg-blue-500 text-white p-2 m-2 rounded-lg hover:bg-gray-600"
        >
          <Icon size="20">
            <IosSettings />
          </Icon>
        </button>
        <button 
          v-if="currentAssistant"
          @click="deleteAssistant"
          class="flex items-center justify-center bg-blue-500 text-white p-2 m-2 rounded-lg hover:bg-red-600"
        >
          <Icon size="20">
            <DeleteRound />
          </Icon>
        </button>
      </div>
    </div>
    
    <div class="flex gap-4 p-4">
      <n-select
        v-model:value="selectedKnowledgeBaseId"
        :options="knowledgeBases.map(kb => ({ label: kb.name, value: kb.kid }))"
        placeholder="选择知识库"
        class="flex-1"
      />
      <n-select
        v-model:value="selectedModel"
        :options="modelOptions"
        placeholder="选择模型"
        class="flex-1"
      />
    </div>
    <hr>
    <div v-if="currentAssistant" class="chat-content flex-1 overflow-y-auto mb-4 space-y-4 p-4">
      <div v-if="messages.length === 0" class="flex flex-col items-center justify-center h-full">
        <h2 class="text-2xl font-bold mb-4">欢迎使用{{ currentAssistant.name }}</h2>
        <p class="text-gray-600">开始新的对话吧！(美化之后再说)</p>
      </div>
      <div 
        v-else
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