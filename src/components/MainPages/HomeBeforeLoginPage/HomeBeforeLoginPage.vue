<template>
    <div class="flex flex-col h-screen">
      <HeaderB />
      <div class="flex flex-1">
        <LeftSmallListB />
      </div>
    </div>
  </template>
  
  <script>
  import HeaderB from '../../PublicComponents/HeaderB.vue';
  import LeftSmallListB from '../../PublicComponents/LeftSmallListB.vue';
  
  export default {
    components: { HeaderB, LeftSmallListB}
  };
  </script>
  
  <style scoped></style>
  