<template>
  <n-spin :show="serviceStore.isLoading">
    <n-alert
      v-if="serviceStore.error"
      type="error"
      title="加载失败"
      :description="serviceStore.error.message"
      class="mb-4"
    />
    <n-layout class="h-screen" has-sider>
      <!-- 左侧用户列表 -->
      <n-layout-sider
        width="25%"
        bordered
        collapse-mode="width"
        :collapsed-width="64"
        :native-scrollbar="false"
        class="bg-blue-50"
      >
        <div class="p-4">
          <n-h2 class="text-blue-800">用户列表</n-h2>
          <n-list bordered>
            <n-list-item 
              v-for="user in serviceStore.userList" 
              :key="user.id"
              @click="serviceStore.setCurrentUser(user.id)"
            >
              <n-thing :title="user.name" :description="user.lastMessage" />
            </n-list-item>
          </n-list>
          
          <div class="absolute bottom-4 left-4 right-4">
            <n-button 
              type="error" 
              block
              @click="handleLogout"
              class="bg-red-500 hover:bg-red-600"
            >
              退出登录
            </n-button>
          </div>
        </div>
      </n-layout-sider>

      <!-- 中间聊天区域 -->
      <n-layout-content class="bg-white">
        <div class="h-full flex flex-col">
          <div class="p-4 border-b">
            <n-h2 class="text-blue-800">对话内容</n-h2>
          </div>
          
          <div class="flex-1 overflow-y-auto p-4" style="min-height: 0;">
            <div v-if="serviceStore.messages.length === 0" class="flex items-center justify-center h-full">
              <p class="text-gray-500">暂无消息记录</p>
            </div>
            <div 
              v-else
              v-for="(msg, index) in serviceStore.messages" 
              :key="index"
              :class="{
                'flex justify-end mb-2': msg.sender === 'me',
                'flex justify-start mb-2': msg.sender === 'user'
              }"
            >
              <div 
                :class="{
                  'bg-blue-500 text-white rounded-l-lg rounded-br-lg px-4 py-2 max-w-xs': msg.sender === 'me',
                  'bg-gray-200 rounded-r-lg rounded-bl-lg px-4 py-2 max-w-xs': msg.sender === 'user'
                }"
              >
                {{ msg.content }}
              </div>
            </div>
          </div>

          <div class="p-4 border-t">
            <div class="flex gap-2">
              <n-input
                v-model:value="newMessage"
                type="textarea"
                placeholder="输入消息..."
                class="flex-1"
              />
              <n-button type="primary" @click="sendMessage">发送</n-button>
            </div>
          </div>
        </div>
      </n-layout-content>

      <!-- 右侧常用回答 -->
      <n-layout-sider
        width="25%"
        bordered
        collapse-mode="width"
        :collapsed-width="64"
        :native-scrollbar="false"
        class="bg-blue-50"
      >
        <div class="p-4">
          <n-h2 class="text-blue-800">常用回答</n-h2>
          <n-collapse>
            <n-collapse-item
              v-for="(item, index) in serviceStore.quickReplies"
              :key="index"
              :title="item.category"
            >
              <n-list>
                <n-list-item
                  v-for="(reply, i) in item.replies"
                  :key="i"
                  @click="selectQuickReply(reply)"
                >
                  {{ reply }}
                </n-list-item>
              </n-list>
            </n-collapse-item>
          </n-collapse>
        </div>
      </n-layout-sider>
    </n-layout>
  </n-spin>
</template>

<script setup>
import {
  NLayout,
  NLayoutSider,
  NLayoutContent,
  NList,
  NListItem,
  NThing,
  NH2,
  NInput,
  NButton,
  NCollapse,
  NCollapseItem,
  NSpin,
  NAlert
} from 'naive-ui'
import { useServiceStore } from '../../stores/serviceStore'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const serviceStore = useServiceStore()
const newMessage = ref('')

const handleLogout = () => {
  router.push('/login')
}

onMounted(async () => {
  await serviceStore.initData()
})

const selectQuickReply = (reply) => {
  newMessage.value = reply
}

const sendMessage = () => {
  if (newMessage.value.trim()) {
    serviceStore.sendMessage(newMessage.value)
    newMessage.value = ''
  }
}
</script>

<style scoped>
/* 确保聊天区域高度正确 */
.n-layout-content {
  display: flex;
  flex-direction: column;
}
</style>
