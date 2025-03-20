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
      <button @click="addMenu" class="mt-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600 opacity-0 hover:opacity-100 transition-opacity duration-200">
        添加菜单
      </button>
    </aside>
  </template>
    
  <script>
  export default {
    name: "ChatHistory",
    data() {
      return {
        menus: ["菜单1", "菜单2", "菜单3", "菜单4"]
      };
    },
    methods: {
      addMenu() {
        const newMenu = `菜单${this.menus.length + 1}`;
        this.menus.push(newMenu);
      },
      deleteMenu(index) {
        this.menus.splice(index, 1);
      }
    }
  };
  </script>
    
  <style scoped></style>
    