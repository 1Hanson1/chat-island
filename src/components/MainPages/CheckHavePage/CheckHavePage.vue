<template>
  <n-config-provider :theme-overrides="themeOverrides">
    <div class="flex flex-col h-screen">
      <Header />
      <div class="flex flex-1">
        <LeftSmallList />
        <div class="flex-1 p-8">
          <n-card title="AI 使用余量" class="max-w-4xl mx-auto">
            <div v-if="hasDuration" class="mb-6 p-4 bg-blue-50 rounded-lg">
              <div class="text-lg font-semibold text-blue-800">已购买时长套餐</div>
              <div class="mt-2 grid grid-cols-2 gap-4">
                <div>
                  <span class="text-gray-600">套餐名称:</span>
                  <span class="ml-2 font-medium">{{ durationData.name }}</span>
                </div>
                <div>
                  <span class="text-gray-600">剩余时长:</span>
                  <span class="ml-2 font-medium">{{ durationData.remainingDays }}天</span>
                </div>
                <div>
                  <span class="text-gray-600">有效期至:</span>
                  <span class="ml-2 font-medium">{{ durationData.expireDate }}</span>
                </div>
              </div>
              <div class="mt-2 text-sm text-gray-500">
                在有效期内使用AI模型不会消耗Token
              </div>
            </div>

            <n-data-table
              :columns="columns"
              :data="aiModels"
              :bordered="true"
              class="mb-8"
            />
            
            <div class="flex justify-end">
              <n-button 
                type="primary" 
                @click="goToPurchase"
                class="w-32"
              >
                续费
              </n-button>
            </div>
          </n-card>
        </div>
      </div>
    </div>
  </n-config-provider>
</template>

<script>
import Header from '../../PublicComponents/Header.vue';
import LeftSmallList from '../../PublicComponents/LeftSmallList.vue';
import { NCard, NDataTable, NButton, NTag } from 'naive-ui';
import { defineComponent, ref, computed } from 'vue';
import { NConfigProvider } from 'naive-ui';
import router from '../../../router';

export default defineComponent({
  components: { 
    Header, 
    LeftSmallList,
    NCard,
    NDataTable,
    NButton,
    NTag,
    NConfigProvider
  },
  setup() {
    // 是否有时长套餐
    const hasDuration = ref(true);
    
    // 时长套餐数据
    const durationData = ref({
      name: '年卡',
      remainingDays: 180,
      expireDate: '2025-11-22'
    });

    // 表格列定义
    const columns = [
      {
        title: '模型名称',
        key: 'model',
        align: 'center'
      },
      {
        title: '剩余Token',
        key: 'remainingTokens',
        align: 'center',
        render(row) {
          return `${row.remainingTokens.toLocaleString()} / ${row.totalTokens.toLocaleString()}`;
        }
      },
      {
        title: '使用比例',
        key: 'usageRatio',
        align: 'center',
        render(row) {
          const ratio = (row.remainingTokens / row.totalTokens * 100).toFixed(1);
          return `${ratio}%`;
        }
      },
    ];

    const aiModels = computed(() => {
      return [
        {
          model: 'GPT-4',
          remainingTokens: 125000,
          totalTokens: 500000
        },
        {
          model: 'Claude 2',
          remainingTokens: 75000,
          totalTokens: 300000
        },
        {
          model: 'DeepSeek',
          remainingTokens: 5000,
          totalTokens: 100000
        },
        {
          model: 'Llama 2',
          remainingTokens: 250000,
          totalTokens: 500000
        }
      ];
    });

    // 跳转到购买页面
    const goToPurchase = () => {
      router.push('/purchase');
    };

    const themeOverrides = {
      common: {
        primaryColor: '#1e48f1', 
        primaryColorHover: '#1e48f1',
        primaryColorPressed: '#3D72D9',
      },
    };

    return {
      hasDuration,
      durationData,
      columns,
      aiModels,
      goToPurchase,
      themeOverrides
    };
  }
});
</script>

<style scoped>
.n-card {
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.n-data-table {
  margin-bottom: 24px;
}

.bg-blue-50 {
  background-color: #eff6ff;
}
</style>
