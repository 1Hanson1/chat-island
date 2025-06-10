import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useHaveStore } from './HaveStore';
import { upgradeVip } from '../api/user';

export const usePurchaseStore = defineStore('purchase', () => {
  const haveStore = useHaveStore();
  
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

  const selectTokenPlan = (index) => {
    selectedTokenPlan.value = index;
    activeTab.value = 'token';
  };

  const selectDurationPlan = (index) => {
    selectedDurationPlan.value = index;
    activeTab.value = 'duration';
  };

  const setSelectedModel = (model) => {
    selectedModel.value = model;
  };

  const handlePurchase = async () => {
    if (activeTab.value === 'token') {
      const plan = tokenPlans.value[selectedTokenPlan.value];
      if (selectedModel.value === null) {
        console.error('请选择模型');
        return;
      }
      
      // 计算购买的Token数量（将"万"转换为实际数字）
      const tokens = parseInt(plan.tokens) * 10000;
      
      haveStore.purchaseTokens(selectedModel.value, tokens);
      
      console.log(`成功购买${plan.tokens}Token，模型: ${selectedModel.value}`);
    } else {
      // 时长购买逻辑
      const plan = durationPlans.value[selectedDurationPlan.value];
      const days = parseInt(plan.duration);
      
      // 首次购买时长套餐时设置hasDuration为true
      if (!haveStore.hasDuration) {
        haveStore.hasDuration = true;
      }
      
      // 使用store方法更新时长信息
      haveStore.purchaseDuration({
        name: plan.name,
        days: days,
        expireDate: calculateExpireDate(days)
      });
      
      console.log(`成功购买${plan.duration}时长套餐`);
      // 调用升级VIP接口
      try {
        await upgradeVip({ name: JSON.parse(localStorage.getItem('user'))['username'], vipKey: '$$$$$$$$$$' });
        console.log('VIP升级成功');
      } catch (error) {
        console.error('VIP升级失败:', error);
      }
    }
    
      // 强制触发响应式更新（确保aiModels存在）
      if (haveStore.aiModels && haveStore.aiModels.value) {
        haveStore.aiModels.value = [...haveStore.aiModels.value];
      }
  };

  const calculateExpireDate = (additionalDays) => {
    const date = new Date();
    date.setDate(date.getDate() + haveStore.durationData.remainingDays + additionalDays);
    return date.toISOString().split('T')[0];
  };

  return {
    activeTab,
    selectedModel,
    selectedTokenPlan,
    selectedDurationPlan,
    tokenPlans,
    durationPlans,
    modelOptions,
    handlePurchase,
    selectTokenPlan,
    selectDurationPlan,
    setSelectedModel
  };
});
