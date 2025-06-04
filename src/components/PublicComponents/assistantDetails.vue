<template>
  <n-config-provider :theme-overrides="themeOverrides">
    <div class="flex flex-col h-screen">
      <Header />
      <div class="flex flex-1">
        <LeftSmallList />
        <div class="flex-1 p-6 overflow-auto">
          <div class="flex items-center mb-6">
            <n-button
              text
              type="primary"
              @click="$router.go(-1)"
              class="mr-4"
            >
              <template #icon>
                <n-icon>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                  </svg>
                </n-icon>
              </template>
              返回
            </n-button>
          <h1 class="text-2xl font-bold">{{ assistant.name || '助手' }}详情</h1>
          </div>

          <n-card>
            <div class="flex items-start gap-6">
              <n-avatar
                round
                :style="{ backgroundColor: '#eff6ff', color: '#3b82f6' }"
                size="large"
              >
                {{ assistant.name ? assistant.name.charAt(0) : '?' }}
              </n-avatar>
              <div>
                <h2 class="text-xl font-semibold mb-2">{{ assistant.name }}</h2>
                <p class="text-gray-600 mb-4">{{ assistant.description }}</p>
                
                <n-space :size="[8, 8]" class="mb-6">
                  <n-tag
                    v-for="tag in assistant.tags"
                    :key="tag"
                    type="info"
                    round
                  >
                    {{ tag }}
                  </n-tag>
                </n-space>

                <n-button type="primary" @click="addAssistant" :disabled="isLoading">
                  添加此助手
                </n-button>
              </div>
            </div>

            <div class="mt-8">
              <h3 class="text-lg font-medium mb-4">功能说明</h3>
              <p class="text-gray-700">{{ assistant.details || '暂无详细功能说明' }}</p>
            </div>
          </n-card>
        </div>
      </div>
    </div>


  </n-config-provider>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { 
  NButton, 
  NIcon, 
  NAvatar, 
  NTag, 
  NSpace,
  NCard,
  NConfigProvider,
} from 'naive-ui';
import Header from './Header.vue';
import LeftSmallList from './LeftSmallList.vue';
import { assistantSquareData } from '../../stores/assistantSquareData';
import { useAssistantStore } from '../../stores/assistantStore';

const themeOverrides = {
  common: {
    primaryColor: '#1e48f1', 
    primaryColorHover: '#1e48f1',
    primaryColorPressed: '#3D72D9',
  }
};

export default defineComponent({
  name: 'AssistantDetails',
  components: { 
    Header,
    LeftSmallList,
    NButton,
    NIcon,
    NAvatar,
    NTag,
    NSpace,
    NCard,
    NConfigProvider,
  },
  setup() {
    const route = useRoute();
    const assistantStore = useAssistantStore();
    const assistant = ref({
      name: '',
      description: '',
      tags: [],
      details: ''
    });
    const isLoading = ref(true);

    const isTool = ref(false);

    onMounted(async () => {
      try {
        const id = parseInt(route.params.id);
        isTool.value = route.name === 'ToolDetails';
        
        if (isTool.value) {
          assistant.value = assistantSquareData.allTools.find(t => t.id === id) || {};
        } else {
          assistant.value = assistantSquareData.allAssistants.find(a => a.id === id) || {};
        }

        if (!assistant.value.id) {
          router.back();
        }
      } catch (error) {
        console.error(error);
      } finally {
        isLoading.value = false;
      }
    });

    const addAssistant = () => {
      if (confirm(`确定要添加助手 "${assistant.value.name}" 吗？`)) {
        assistantStore.addAssistant(assistant.value);
      }
    };

    return {
      assistantStore,
      themeOverrides,
      assistant,
      addAssistant
    };
  }
});
</script>