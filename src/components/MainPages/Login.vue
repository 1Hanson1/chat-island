<template>
  <div class="flex flex-col h-screen">
    <Header />
    <div class="flex flex-1">
      <LeftSmallList />
    </div>
  </div>
</template>

<script>
import Header from '../Header.vue';
import LeftSmallList from '../LeftSmallList.vue';

export default {
  components: { Header, LeftSmallList}
};
</script>

<style scoped></style>
