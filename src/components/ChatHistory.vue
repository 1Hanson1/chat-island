<script setup>
import { ref } from "vue";

function deleteMenu(index) {
  menus.value.splice(index, 1);
}

const menus = ref(["菜单1", "菜单2", "菜单3"]);

</script>

<template>
    <aside class="bg-gray-200 w-64 p-4">
      <ul>
        <li v-for="(menu, index) in menus" :key="index" class="p-2 hover:bg-gray-300 flex justify-between items-center group">
          <a href="#">{{ menu }}</a>
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
    
  <style scoped></style>
    