<template>
    <div class="flex flex-col h-screen">
      <Header />
      <div class="flex flex-1">
        <LeftSmallList />
        <PersonalLeftList />
      </div>
    </div>
  </template>
  
  <script>
  import Header from '../../PublicComponents/Header.vue';
  import LeftSmallList from '../../PublicComponents/LeftSmallList.vue';
  import PersonalLeftList from './PersonalLeftList.vue';
  
  export default {
    components: { Header, LeftSmallList, PersonalLeftList}
  };
  </script>
  
  <style scoped></style>
  