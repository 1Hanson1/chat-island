<template>
  <div class="flex flex-col h-screen">
    <Header />
    <div class="flex flex-1">
      <LeftSmallList />
      <div class="flex-1 p-8">
        <n-config-provider :theme-overrides="themeOverrides">
          <n-card title="购买套餐" class="max-w-4xl mx-auto">
            <n-tabs type="line" animated>
              <n-tab-pane name="token" tab="按Token量购买">
                <div class="mb-4">
                  <n-select
                    :options="purchaseStore.modelOptions"
                    placeholder="请选择模型"
                    clearable
                    @update:value="setSelectedModel"
                  />
                </div>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <n-card
                    v-for="(plan, index) in tokenPlans"
                    :key="index"
                    :class="{'border-2 border-blue-500': selectedTokenPlan === index}"
                    hoverable
                    @click="selectTokenPlan(index)"
                  >
                    <template #header>
                      <div class="text-xl font-bold">{{ plan.name }}</div>
                    </template>
                    <div class="space-y-2">
                      <div class="flex justify-between">
                        <span>Token数量:</span>
                        <span class="font-bold">{{ plan.tokens }}</span>
                      </div>
                      <div class="flex justify-between">
                        <span>价格:</span>
                        <span class="text-blue-600 font-bold">¥{{ plan.price }}</span>
                      </div>
                      <div class="flex justify-between">
                        <span>单价:</span>
                        <span>¥{{ plan.unitPrice }}/万Token</span>
                      </div>
                    </div>
                  </n-card>
                </div>
              </n-tab-pane>

              <n-tab-pane name="duration" tab="按时长购买">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <n-card
                    v-for="(plan, index) in durationPlans"
                    :key="index"
                    :class="{'border-2 border-blue-500': selectedDurationPlan === index}"
                    hoverable
                    @click="selectDurationPlan(index)"
                  >
                    <template #header>
                      <div class="text-xl font-bold">{{ plan.name }}</div>
                    </template>
                    <div class="space-y-2">
                      <div class="flex justify-between">
                        <span>使用时长:</span>
                        <span class="font-bold">{{ plan.duration }}</span>
                      </div>
                      <div class="flex justify-between">
                        <span>价格:</span>
                        <span class="text-blue-600 font-bold">¥{{ plan.price }}</span>
                      </div>
                      <div class="flex justify-between">
                        <span>每日费用:</span>
                        <span>¥{{ plan.dailyPrice }}/天</span>
                      </div>
                    </div>
                  </n-card>
                </div>
              </n-tab-pane>
            </n-tabs>

            <div class="mt-8 flex justify-between items-center">
              <div class="text-lg">
                总计: <span class="text-blue-600 font-bold text-xl">
                  ¥{{ 
                    activeTab === 'token' 
                      ? tokenPlans[selectedTokenPlan].price 
                      : durationPlans[selectedDurationPlan].price 
                  }}
                </span>
                
                当前选中: <span class="text-blue-600 font-bold text-xl">
                  {{ 
                    activeTab === 'token' 
                      ? tokenPlans[selectedTokenPlan].name 
                      : durationPlans[selectedDurationPlan].name 
                  }}
                </span>

                <span v-if="activeTab === 'token' && selectedModel" class="ml-4">
                  购买模型:<span class="text-blue-600 font-bold">{{ selectedModel }}</span>
                </span>

              </div>
              <n-button type="primary" size="large" @click="handlePurchase()">
                立即购买
              </n-button>
            </div>
          </n-card>
        </n-config-provider>
      </div>
    </div>
  </div>
</template>

<script>
import { NCard, NTabs, NTabPane, NButton, NIcon, NConfigProvider, NSelect } from 'naive-ui';
import Header from '../../PublicComponents/Header.vue';
import LeftSmallList from '../../PublicComponents/LeftSmallList.vue';
import { usePurchaseStore } from '../../../stores/Purchase';
import { storeToRefs } from 'pinia';

export default {
  components: {
    Header,
    LeftSmallList,
    NCard,
    NTabs,
    NTabPane,
    NButton,
    NIcon,
    NConfigProvider,
    NSelect
  },
  setup() {
    const purchaseStore = usePurchaseStore();
    const { activeTab, selectedModel, selectedTokenPlan, selectedDurationPlan, tokenPlans, durationPlans, modelOptions} = storeToRefs(purchaseStore);

    const themeOverrides = {
      common: {
        primaryColor: '#3b82f6',
        primaryColorHover: '#3b72ff',
        primaryColorPressed: '#3b62e6'
      }
    };

    return {
      activeTab,
      selectedModel,
      selectedTokenPlan,
      selectedDurationPlan,
      tokenPlans,
      durationPlans,
      modelOptions,
      purchaseStore,
      setSelectedModel: purchaseStore.setSelectedModel,
      selectTokenPlan: purchaseStore.selectTokenPlan,
      selectDurationPlan: purchaseStore.selectDurationPlan,
      handlePurchase: purchaseStore.handlePurchase,
      themeOverrides
    };
  }
};
</script>

<style scoped>
.n-card {
  cursor: pointer;
  transition: all 0.2s ease;
}
</style>
