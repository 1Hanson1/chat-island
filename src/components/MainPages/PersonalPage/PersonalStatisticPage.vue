<template>
  <div class="flex flex-col h-screen">
    <Header />
    <div class="flex flex-1">
      <LeftSmallList />
      <div class="flex flex-1" >
        <PersonalLeftList />
        <div class="p-6 flex-1">
          <n-config-provider :theme-overrides="themeOverrides">
            <n-card title="AI 使用统计" class="shadow-sm">
              <n-tabs type="line">
                <n-tab-pane name="daily" tab="每日用量">
                  <n-data-table
                    :columns="dailyColumns"
                    :data="dailyData"
                    :bordered="false"
                  />
                </n-tab-pane>
                <n-tab-pane name="weekly" tab="每周用量">
                  <n-data-table
                    :columns="weeklyColumns"
                    :data="weeklyData"
                    :bordered="false"
                  />
                </n-tab-pane>
                <n-tab-pane name="total" tab="总用量">
                  <n-data-table
                    :columns="totalColumns"
                    :data="totalData"
                    :bordered="false"
                  />
                </n-tab-pane>
              </n-tabs>
            </n-card>
          </n-config-provider> 
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Header from '../../PublicComponents/Header.vue';
import LeftSmallList from '../../PublicComponents/LeftSmallList.vue';
import PersonalLeftList from './PersonalLeftList.vue';
import { NCard, NTabs, NTabPane, NDataTable } from 'naive-ui';
import { NConfigProvider } from 'naive-ui';

export default {
components: { 
  Header, 
  LeftSmallList, 
  PersonalLeftList,
  NCard,
  NTabs,
  NTabPane,
  NDataTable,
  NConfigProvider
},
setup() {
    const themeOverrides = {
      common: {
        primaryColor: '#5B8FF9', 
        primaryColorHover: '#7DA6F9',
        primaryColorPressed: '#3D72D9',
        primaryColorSuppl: '#5B8FF9'
      },
      Card: {
        titleTextColor: '#5B8FF9' 
      },
      Tabs: {
        tabTextColorActive: '#5B8FF9', 
        tabTextColorHover: '#7DA6F9', 
        barColor: '#5B8FF9' 
      }
    };

    return {
      themeOverrides
    };
  },
data() {
  return {
    dailyColumns: [
      { title: '模型', key: 'model' },
      { title: '日期', key: 'date' },
      { title: 'Token用量', key: 'tokens' },
      { title: '对话次数', key: 'conversations' }
    ],
    weeklyColumns: [
      { title: '模型', key: 'model' },
      { title: '周数', key: 'week' },
      { title: 'Token用量', key: 'tokens' },
      { title: '对话次数', key: 'conversations' }
    ],
    totalColumns: [
      { title: '模型', key: 'model' },
      { title: 'Token总量', key: 'totalTokens' },
      { title: '总对话次数', key: 'totalConversations' }
    ],
    dailyData: [
      { model: 'GPT-4', date: '2025-03-01', tokens: '12,345', conversations: 15 },
      { model: 'DeepSeek', date: '2025-03-01', tokens: '8,765', conversations: 23 }
    ],
    weeklyData: [
      { model: 'GPT-4', week: '2025年第12周', tokens: '85,432', conversations: 98 },
      { model: 'DeepSeek', week: '2025年第12周', tokens: '65,321', conversations: 145 }
    ],
    totalData: [
      { model: 'GPT-4', totalTokens: '1,234,567', totalConversations: 1234 },
      { model: 'DeepSeek', totalTokens: '2,345,678', totalConversations: 2345 }
    ]
  };
}
};
</script>

<style scoped>
.n-card {
margin-bottom: 20px;
}
</style>
