<template>
  <div class="flex flex-col h-screen">
    <Header />
    <div class="flex flex-1">
      <AssisantList />
      <ChatMainContent />
      <ChatHistory />
    </div>
  </div>
</template>

<script>
import Header from './components/Header.vue';
import AssisantList from './components/AssisantList.vue';
import ChatMainContent from './components/ChatMainContent.vue';
import ChatHistory from './components/ChatHistory.vue';

export default {
  components: { Header, AssisantList, ChatMainContent, ChatHistory }
};
</script>

<style scoped></style>
