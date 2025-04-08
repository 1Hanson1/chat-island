<template>
  <header class="header bg-blue-600 text-white p-4 flex justify-between items-center">
    <div class="flex items-center">
      <Icon size="24"><Money16Regular /></Icon>
      <h1 class="text-xl font-bold ml-5">Chat Island</h1>
    </div>
    <nav class="flex-shrink-0">
      <ul class="flex gap-8">
        <li><router-link to="/" class="hover:underline">首页</router-link></li>
        <li><router-link to="/login"  class="hover:underline">余量</router-link></li>
        <li><router-link to="/login"  class="hover:underline">助手</router-link></li>
        <li><router-link to="/login"  class="hover:underline">购买</router-link></li>
        <li><router-link to="/login"  class="hover:underline">登录</router-link></li>
      </ul>
    </nav>
  </header>
</template>

<script> 
  import { Money16Regular } from '@vicons/fluent'
  import { Icon } from '@vicons/utils'
  export default {
    name: 'Header',
    components: {
      Money16Regular,
      Icon
    },
  }
</script>
<style scoped>
.header{
  font-size:1rem;
}
</style>
  