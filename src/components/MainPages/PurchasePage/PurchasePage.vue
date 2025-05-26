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
                    v-model:value="selectedModel"
                    :options="modelOptions"
                    placeholder="请选择模型"
                    clearable
                  />
                </div>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <n-card
                    v-for="(plan, index) in tokenPlans"
                    :key="index"
                    :class="{'border-2 border-blue-500': selectedTokenPlan === index}"
                    hoverable
                    @click="selectedTokenPlan = index, activeTab = 'token'"
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
                    @click="selectedDurationPlan = index, activeTab = 'duration'"
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
              <n-button type="primary" size="large" @click="handlePurchase">
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
import { ref, computed } from 'vue';
import { NCard, NTabs, NTabPane, NButton, NIcon, NConfigProvider,NSelect } from 'naive-ui';
import Header from '../../PublicComponents/Header.vue';
import LeftSmallList from '../../PublicComponents/LeftSmallList.vue';

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
    const activeTab = ref('token');
    const selectedModel = ref(null);
    const selectedTokenPlan = ref(0);
    const selectedDurationPlan = ref(0);

    const tokenPlans = ref([
      { name: '基础套餐', tokens: '100万', price: 10, unitPrice: 1 },
      { name: '标准套餐', tokens: '500万', price: 45, unitPrice: 0.9 },
      { name: '高级套餐', tokens: '2000万', price: 160, unitPrice: 0.8 }
    ]);

    const durationPlans = ref([
      { name: '月卡', duration: '30天', price: 30, dailyPrice: 1 },
      { name: '季卡', duration: '90天', price: 80, dailyPrice: 0.89 },
      { name: '年卡', duration: '365天', price: 299, dailyPrice: 0.82 }
    ]);

    const modelOptions = [
      { label: 'GPT-4', value: 'GPT-4' },
      { label: 'Claude 2', value: 'Claude 2' },
      { label: 'DeepSeek', value: 'DeepSeek' },
      { label: 'Llama 2', value: 'Llama 2' }
    ];

    const themeOverrides = {
      common: {
        primaryColor: '#3b82f6',
        primaryColorHover: '#3b72ff',
        primaryColorPressed: '#3b62e6'
      }
    };

    const handlePurchase = () => {
      const plan = activeTab.value === 'token'
        ? {
            ...tokenPlans.value[selectedTokenPlan.value],
            model: selectedModel.value?.label || '未选择模型'
          }
        : durationPlans.value[selectedDurationPlan.value];

      console.log(selectedModel.value);
      console.log('购买套餐:', plan);
      // 这里可以添加实际的购买逻辑
    };


    return {
      activeTab,
      selectedModel,
      selectedTokenPlan,
      selectedDurationPlan,

      tokenPlans,
      durationPlans,
      modelOptions,

      themeOverrides,
      handlePurchase
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
