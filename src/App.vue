<template>
  <div class="flex flex-col h-screen">
    <Header />
    <div class="flex flex-1">
      <SidebarLeft />
      <MainContent />
      <SidebarRight />
    </div>
  </div>
</template>

<script>
import Header from './components/Header.vue';
import SidebarLeft from './components/SidebarLeft.vue';
import MainContent from './components/MainContent.vue';
import SidebarRight from './components/SidebarRight.vue';

export default {
  components: { Header, SidebarLeft, MainContent, SidebarRight }
};
</script>

<style scoped></style>
