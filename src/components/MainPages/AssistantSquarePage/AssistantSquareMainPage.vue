<template>
  <n-config-provider :theme-overrides="themeOverrides">
    <div class="flex flex-col h-screen">
      <Header />
      <div class="flex flex-1">
        <LeftSmallList />
        <div class="flex-1 p-6 overflow-auto">
        <h1 class="text-2xl font-bold mb-6">助手与工具广场</h1>
        
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
      themeOverrides
    };
  },
  data() {
    return {
      recommendedAssistants: [
        {
          id: 1,
          name: '写作助手',
          description: '帮助您撰写各类文章'
        },
        {
          id: 2,
          name: '编程助手',
          description: '解答编程问题'
        },
        {
          id: 3,
          name: '学习助手',
          description: '辅助学习新知识'
        }
      ],
      recommendedTools: [
        {
          id: 1,
          name: 'PDF转换',
          description: 'PDF文件转换工具'
        },
        {
          id: 2,
          name: '图片处理',
          description: '在线图片编辑'
        },
        {
          id: 3,
          name: '翻译插件',
          description: '多语言翻译工具'
        }
      ]
    }
  }
});
</script>

<style scoped>
/* 可以添加一些自定义样式 */
</style>
