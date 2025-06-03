import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useHaveStore = defineStore('have', () => {
  // 是否有时长套餐
  const hasDuration = ref(false);
  
  // 时长套餐数据
  const durationData = ref({
    name: '',
    remainingDays: 0,
    expireDate: ''
  });

  // AI模型数据
  const aiModels = ref([
    {
      model: 'GPT-4',
      usedTokens: 0,
      totalTokens: 0
    },
    {
      model: 'Claude 2',
      usedTokens: 0,
      totalTokens: 0
    },
    {
      model: 'DeepSeek',
      usedTokens: 0,
      totalTokens: 0
    },
    {
      model: 'Llama 2',
      usedTokens: 0,
      totalTokens: 0
    }
  ]);

  // 更新Token余量
  const purchaseTokens = (modelName, purchasedTokens) => {
    const model = aiModels.value.find(m => m.model === modelName);
    if (model) {
      model.totalTokens += purchasedTokens;
      aiModels.value = [...aiModels.value]; // 触发响应式更新
    }
  };

  const useTokens = (modelName, tokensUsed) => {
    const model = aiModels.value.find(m => m.model === modelName);
    if (model) {
      model.usedTokens += tokensUsed;
      aiModels.value = [...aiModels.value]; // 触发响应式更新
    }
  };

  // 购买时长套餐
  const purchaseDuration = ({name, days, expireDate}) => {
    if (!hasDuration.value) {
      hasDuration.value = true;
    }
    durationData.value = {
      name,
      remainingDays: durationData.value.remainingDays + days,
      expireDate
    };
  };

  return {
    hasDuration,
    durationData,
    aiModels,
    purchaseTokens,
    useTokens,
    purchaseDuration
  };
});
