<template>
  <div class="flex flex-col h-screen">
    <Header />
    <div class="flex flex-1">
      <LeftSmallList />
      <AssisantList />
      <ChatMainContent />
      <ChatHistory />
    </div>
  </div>
</template>

<script>
import Header from './components/Header.vue';
import LeftSmallList from './components/LeftSmallList.vue';
import AssisantList from './components/AssisantList.vue';
import ChatMainContent from './components/ChatMainContent.vue';
import ChatHistory from './components/ChatHistory.vue';

export default {
  components: { Header, LeftSmallList,AssisantList, ChatMainContent, ChatHistory }
};
</script>

<style scoped></style>
