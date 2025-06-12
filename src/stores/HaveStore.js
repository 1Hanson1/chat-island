import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { getUserInfo } from '../api/user'

export const useHaveStore = defineStore('have', () => {
  // 是否有时长套餐
  const hasDuration = ref(false);
  
  // 时长套餐数据
  const durationData = ref({
    name: '时长套餐',
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
      model: 'qwen-turbo',
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

  async function upgradeDuration() {
    const username = JSON.parse(localStorage.getItem('user'))['username'];
    const response_info = await getUserInfo({name:username});
    console.log(response_info.data.userInfo);
    const vipStartTime = response_info.data.userInfo.vipStartTime;
    const vipEndTime = response_info.data.userInfo.vipEndTime;
    console.log(vipStartTime, vipEndTime);
    if(vipStartTime && vipEndTime) {
      hasDuration.value = true;
      const endTime = new Date(vipEndTime).getTime();
      const remainingDays = Math.ceil((endTime - Date.now()) / (24 * 60 * 60 * 1000));
      durationData.value = {
        name: '时长套餐',
        remainingDays,
        expireDate: new Date(vipEndTime).toLocaleDateString()
      };
    }
    else{
      durationData.value = {
        name: '时长套餐',
        remainingDays: 0,
        expireDate: ''
      }
    }
  }
  return {
    hasDuration,
    durationData,
    aiModels,
    purchaseTokens,
    useTokens,
    upgradeDuration
  };
});
