<script setup>
import { ref } from "vue";

const menus = ref(["论文助手", "菜谱助手", "运动助手", "翻译助手"]);

function addMenu() {
  const newMenu = `助手${menus.value.length + 1}`;
  menus.value.push(newMenu);
}

function deleteMenu(index) {
  menus.value.splice(index, 1);
}
</script>

<template>
  <aside class="bg-gray-300 w-80 ">
    <div class="flex items-center justify-center bg-gray-200 h-15">
      <h2 class="list-title font-bold mt-2">助手列表</h2>
    </div>
    <ul>
      <li v-for="(menu, index) in menus" :key="index" class="p-2 hover:bg-gray-300 flex justify-between items-center group">
        <a href="#" class="ml-4 list-item">{{ menu }}</a>
          <p>
            <button @click="settingsMenu(index)" class="ml-2 text-gray-500 hover:text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              设置
            </button>
            <button @click="deleteMenu(index)" class="ml-2 text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              删除
            </button>
          </p>
      </li>
    </ul>
    <button @click="addMenu" class="mt-4 ml-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600 opacity-0 hover:opacity-100 transition-opacity duration-200">
      添加助手
    </button>
  </aside>
</template>
  
<style scoped>
.list-title{
  font-size: 1.5rem;
}
.list-item {
  font-size: 1.2rem;
}
</style>
  