<script setup>
import { ref } from "vue";

function deleteMenu(index) {
  menus.value.splice(index, 1);
}

const menus = ref(["标题1", "标题2", "标题3"]);

</script>

<template>
    <aside class="bg-gray-300 w-80">
      <div class="flex items-center justify-center bg-gray-200 h-15">
          <h2 class="list-title font-bold mt-2">对话记录</h2>
        </div>
      <ul>
        <li v-for="(menu, index) in menus" :key="index" class="p-2 hover:bg-gray-300 flex justify-between items-center group">
          <a href="#" class="list-item ml-4">{{ menu }}</a>
          <button @click="deleteMenu(index)" class="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            删除
          </button>
        </li>
      </ul>
    </aside>
  </template>
    
  <script>
  export default {
    name: "ChatHistory",
  };
  </script>
  
<style scoped>
.list-title{
  font-size: 1.5rem;
}
.list-item {
  font-size: 1.2rem;
}
</style>
    