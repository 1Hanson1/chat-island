<template>
  <header class="bg-blue-600 text-white p-4 flex justify-between items-center">
    <div class="text-xl font-bold">LOGO</div>
    <nav class="flex-shrink-0">
      <ul class="flex gap-8">
        <li><router-link to="/home" class="hover:underline">首页</router-link></li>
        <li><router-link to="/check"  class="hover:underline">余量</router-link></li>
        <li><router-link to="/assistantSquare"  class="hover:underline">助手</router-link></li>
        <li><router-link to="/purchase"  class="hover:underline">购买</router-link></li>
        <li><router-link to="/personalPage"  class="hover:underline">个人</router-link></li>
      </ul>
    </nav>
  </header>
</template>

<style scoped></style>
