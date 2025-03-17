<template>
  <div class="flex flex-col h-screen">
    <Header />
    <div class="flex flex-1">
      <Sidebar />
      <MainContent />
    </div>
  </div>
</template>

<script>
import Header from './components/Header.vue';
import Sidebar from './components/Sidebar.vue';
import MainContent from './components/MainContent.vue';

export default {
  components: { Header, Sidebar, MainContent }
};
</script>

<style scoped></style>
