<template>
  <n-config-provider :theme-overrides="themeOverrides">
    <div class="flex flex-col h-screen">
      <Header />
      <div class="flex flex-1">
        <LeftSmallList />
        <div class="flex-1 p-6 overflow-auto">
          <n-card>
            <h1 class="text-4xl font-bold mb-6">助手与工具广场</h1>
            <!-- 推荐助手区域 -->
            <div class="mb-8">
              <div class="flex justify-between items-center mb-4">
                <h2 class="text-xl font-semibold">推荐助手</h2>
                <n-button
                  text
                  type="primary"
                  @click="$router.push('/assistantSquareMainAssPage')"
                >
                  查看全部
                  <template #icon>
                    <n-icon>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="9 18 15 12 9 6"></polyline>
                      </svg>
                    </n-icon>
                  </template>
                </n-button>
              </div>
              <div class="grid grid-cols-3 gap-4">
                <n-card
                  v-for="assistant in recommendedAssistants"
                  :key="assistant.id"
                  :title="assistant.name"
                  hoverable
                  embedded
                  :bordered="false"
                  class="cursor-pointer transition-all hover:scale-[1.02]"
                  @click="viewDetails(assistant)"
                >
                  <div class="flex items-start gap-3">
                    <n-avatar
                      round
                      :style="{ backgroundColor: '#eff6ff', color: '#3b82f6' }"
                      size="medium"
                    >
                      {{ assistant.name.charAt(0) }}
                    </n-avatar>
                    <p class="text-gray-500 text-sm">{{ assistant.description }}</p>
                  </div>
                </n-card>
              </div>
            </div>

            <!-- 推荐工具区域 -->
            <div class="mb-8">
              <div class="flex justify-between items-center mb-4">
                <h2 class="text-xl font-semibold">推荐工具</h2>
                <n-button
                  text
                  type="primary"
                  @click="$router.push('/assistantSquareMainToolsPage')"
                >
                  查看全部
                  <template #icon>
                    <n-icon>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="9 18 15 12 9 6"></polyline>
                      </svg>
                    </n-icon>
                  </template>
                </n-button>
              </div>
              <div class="grid grid-cols-3 gap-4">
                <n-card
                  v-for="tool in recommendedTools"
                  :key="tool.id"
                  :title="tool.name"
                  hoverable
                  embedded
                  :bordered="false"
                  class="cursor-pointer transition-all hover:scale-[1.02]"
                  @click="viewDetails(tool)"
                >
                  <div class="flex items-start gap-3">
                    <n-avatar
                      round
                      :style="{ backgroundColor: '#eff6ff', color: '#3b82f6' }"
                      size="medium"
                    >
                      {{ tool.name.charAt(0) }}
                    </n-avatar>
                    <p class="text-gray-500 text-sm">{{ tool.description }}</p>
                  </div>
                </n-card>
              </div>
            </div>
          </n-card>
        
          
        </div>
      </div>
    </div>
  </n-config-provider>
</template>

<script>  
import { defineComponent } from 'vue';
import { 
  NCard, 
  NButton, 
  NIcon, 
  NAvatar, 
  NConfigProvider
} from 'naive-ui';
import Header from '../../PublicComponents/Header.vue';
import LeftSmallList from '../../PublicComponents/LeftSmallList.vue';
import { assistantSquareData } from '../../../stores/assistantSquareData';

const themeOverrides = {
  common: {
    primaryColor: '#1e48f1', 
    primaryColorHover: '#1e48f1',
    primaryColorPressed: '#3D72D9',
  },
};

export default defineComponent({
  name: 'AssistantSquareMainPage',
  components: { 
    Header, 
    LeftSmallList,
    NCard,
    NButton,
    NIcon,
    NAvatar,
    NConfigProvider
  },
  setup() {
    return {
      themeOverrides,
      assistantSquareData
    };
  },
  data() {
    return {
      recommendedAssistants: assistantSquareData.recommendedAssistants,
      recommendedTools: assistantSquareData.recommendedTools
    }
  },
  methods: {
    viewDetails(item) {
      this.$router.push(`/assistant/${item.id}`);
    }
  }
});
</script>

<style scoped>
/* 可以添加一些自定义样式 */
</style>
