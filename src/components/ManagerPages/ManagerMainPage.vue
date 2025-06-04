<template>
  <n-layout has-sider class="h-screen">
    <!-- Left Sider - Combined Selection and Conversations -->
    <n-layout-sider
      bordered
      collapse-mode="width"
      :collapsed-width="64"
      :width="280"
      show-trigger
      content-style="display: flex; flex-direction: column;"
    >
      <n-tabs type="line" animated class="mb-4">
        <n-tab-pane name="users" tab="Users">
          <n-list class="mb-4">
            <n-list-item
              v-for="user in managerStore.users"
              :key="user.id"
              @click="managerStore.setCurrentSelection('user', user.id)"
              :class="{ 'bg-gray-100': managerStore.currentSelection.type === 'user' && managerStore.currentSelection.id === user.id }"
            >
              <n-thing :title="user.name" />
            </n-list-item>
          </n-list>
        </n-tab-pane>
        <n-tab-pane name="agents" tab="Service Agents">
          <n-list class="mb-4">
            <n-list-item
              v-for="agent in managerStore.serviceAgents"
              :key="agent.id"
              @click="managerStore.setCurrentSelection('serviceAgent', agent.id)"
              :class="{ 'bg-gray-100': managerStore.currentSelection.type === 'serviceAgent' && managerStore.currentSelection.id === agent.id }"
            >
              <n-thing :title="agent.name" />
            </n-list-item>
          </n-list>
        </n-tab-pane>
      </n-tabs>

      <n-divider class="my-2" />

      <n-card title="Conversations" content-style="padding: 0;">
        <n-list>
          <n-list-item
            v-for="conversation in managerStore.getCurrentConversations"
            :key="conversation.id"
            @click="managerStore.setCurrentConversation(conversation.id)"
            :class="{ 'bg-blue-50': managerStore.currentConversation === conversation.id }"
          >
            <n-thing :title="conversation.title" />
          </n-list-item>
        </n-list>
      </n-card>
    </n-layout-sider>

    <!-- Main Content Area -->
    <n-layout-content>
      <n-card
        title="Conversation Content"
        class="h-full m-4"
        content-style="min-height: calc(100vh - 32px);"
      >
        <div v-if="managerStore.currentConversation" class="p-4">
          {{ managerStore.getCurrentConversationContent }}
        </div>
        <div v-else class="flex items-center justify-center h-full text-gray-400">
          Select a conversation to view content
        </div>
      </n-card>
    </n-layout-content>
  </n-layout>
</template>

<script setup>
import { useManagerStore } from '../../stores/ManagerStore'
import {
  NLayout,
  NLayoutSider,
  NLayoutContent,
  NTabs,
  NTabPane,
  NList,
  NListItem,
  NThing,
  NCard
} from 'naive-ui'

const managerStore = useManagerStore()
</script>

<style scoped>
.n-layout-sider {
  transition: all 0.3s ease;
}
</style>
