<template>
  <div class="flex flex-col h-screen">
    <HeaderB />
    <div class="flex flex-1">
      <LeftSmallListB />
      <div class="flex-1 flex justify-end">
          <div class ="w-2/3">
            <LoginInstruction />
          </div>
          <div class="w-1/3 shadow-lg">
            <LoginUser/>
          </div>
      </div>
    </div>
  </div>
</template>

<script>
import HeaderB from '../../PublicComponents/HeaderB.vue';
import LeftSmallListB from '../../PublicComponents/LeftSmallListB.vue';
import LoginInstruction from './LoginInstruction.vue';
import LoginUser from './LoginUser.vue';

export default {
  components: { HeaderB, LeftSmallListB, LoginUser, LoginInstruction }
};
</script>

<style scoped>

</style>
