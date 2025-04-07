<template>
  <div class="flex flex-col h-screen">
    <HeaderB />
    <div class="flex flex-1">
      <LeftSmallListB />
      <aside class="w-80 bg-gray-300 flex flex-col justify-between">
        <div class="flex items-center justify-center bg-blue-200  h-15">
          <h2 class="text-xl font-bold mt-2">助手列表</h2>
        </div>
        <div class="flex items-center justify-center flex-1">
          <p class="text-center">更多功能请登录后使用</p>
        </div>
      </aside>
      <ChatMainContent />
      <aside class="w-80 bg-gray-300 flex flex-col justify-between">
        <div class="flex items-center justify-center bg-blue-200  h-15">
          <h2 class="text-xl font-bold mt-2">对话记录</h2>
        </div>
        <div class="flex items-center justify-center flex-1">
          <p class="text-center">更多功能请登录后使用</p>
        </div>
      </aside>
    </div>
  </div>
</template>

  
  <script>
  import HeaderB from '../../PublicComponents/HeaderB.vue';
  import LeftSmallListB from '../../PublicComponents/LeftSmallListB.vue';
  import ChatMainContent from '../HomeAfterLoginPage/ChatMainContent.vue';
  
  export default {
    components: { HeaderB, LeftSmallListB, ChatMainContent}
  };
  </script>
  
<style scoped>
</style>
  