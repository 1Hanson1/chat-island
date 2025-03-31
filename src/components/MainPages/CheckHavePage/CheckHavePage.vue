<template>
  <div class="flex flex-col h-screen">
    <Header />
    <div class="flex flex-1">
      <LeftSmallList />
      <div class="flex flex-1">
        <h1 class="text-3xl font-bold ml-10 mt-5">Check Have Page</h1>
      </div>
    </div>
  </div>
</template>

<script>
import Header from '../../PublicComponents/Header.vue';
import LeftSmallList from '../../PublicComponents/LeftSmallList.vue';

export default {
  components: { Header, LeftSmallList}
};
</script>

<style scoped></style>
