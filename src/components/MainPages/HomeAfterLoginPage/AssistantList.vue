<script setup>
import { ref } from "vue";

const menus = ref(["菜单1", "菜单2", "菜单3", "菜单4"]);

function addMenu() {
  const newMenu = `菜单${menus.value.length + 1}`;
  menus.value.push(newMenu);
}

function deleteMenu(index) {
  menus.value.splice(index, 1);
}
</script>

<template>
  <aside class="bg-gray-300 w-80 ">
    <div class="flex items-center justify-center bg-gray-200 h-15">
      <h2 class="text-xl font-bold mt-2">助手列表</h2>
    </div>
    <ul>
      <li v-for="(menu, index) in menus" :key="index" class="p-2 hover:bg-gray-300 flex justify-between items-center group">
        <a href="#">{{ menu }}</a>
        <button @click="deleteMenu(index)" class="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          删除
        </button>
      </li>
    </ul>
    <button @click="addMenu" class="mt-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600 opacity-0 hover:opacity-100 transition-opacity duration-200">
      添加菜单
    </button>
  </aside>
</template>
  
<style scoped></style>
  