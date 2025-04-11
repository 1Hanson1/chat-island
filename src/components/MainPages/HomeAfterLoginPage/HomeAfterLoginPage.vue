<template>
  <div class="flex flex-col h-screen">
    <Header />
    <div class="flex flex-1">
      <LeftSmallList />
      <div class="flex flex-1">
        <AssistantList class="w-80" />
        <ChatMainContent class="flex-1" />
        <ChatHistory class="w-80" />
      </div>
    </div>
  </div>
</template>

<script>
import Header from '../../PublicComponents/Header.vue'
import LeftSmallList from '../../PublicComponents/LeftSmallList.vue'  
import AssistantList from './AssistantList.vue'
import ChatMainContent from './ChatMainContent.vue'
import ChatHistory from './ChatHistory.vue'

export default {
  components: { 
    Header,
    LeftSmallList,
    AssistantList,
    ChatMainContent,
    ChatHistory
  }
}
</script>

<style scoped>

</style>
