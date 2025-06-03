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
              @click="$router.push('/assistantSquareMain')"
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
            <h1 class="text-2xl font-bold">助手列表</h1>
          </div>
          
          <!-- 搜索区域 -->
          <div class="mb-6">
            <n-input
              v-model:value="searchQuery"
              placeholder="搜索助手..."
              clearable
              round
            >
              <template #prefix>
                <n-icon :component="Search" />
              </template>
            </n-input>
          </div>

          <!-- 助手列表 -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <n-card
              v-for="assistant in filteredAssistants"
              :key="assistant.id"
              :title="assistant.name"
              hoverable
              embedded
              :bordered="false"
              class="cursor-pointer transition-all hover:scale-[1.02]"
              @click="viewAssistantDetails(assistant)"
            >
              <div class="flex items-start gap-3">
                <n-avatar
                  round
                  :style="{ backgroundColor: '#eff6ff', color: '#3b82f6' }"
                  size="large"
                >
                  {{ assistant.name.charAt(0) }}
                </n-avatar>
                <div>
                  <p class="text-gray-500 text-sm">{{ assistant.description }}</p>
                  <n-space :size="[4, 4]" class="mt-2">
                    <n-tag
                      v-for="tag in assistant.tags"
                      :key="tag"
                      size="small"
                      type="info"
                      round
                    >
                      {{ tag }}
                    </n-tag>
                  </n-space>
                </div>
              </div>
              <template #action>
                <n-button
                  type="primary"
                  block
                  secondary
                  @click.stop="addAssistant(assistant)"
                >
                  添加助手
                </n-button>
              </template>
            </n-card>
          </div>

          <!-- 分页 -->
          <div class="mt-6 flex justify-center">
            <n-pagination
              :page-count="1"
              :page="1"
              :page-slot="5"
            />
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
  NInput, 
  NIcon, 
  NAvatar, 
  NTag, 
  NSpace, 
  NPagination, 
  NConfigProvider 
} from 'naive-ui';
import { Search } from '@vicons/ionicons5';
import Header from '../../PublicComponents/Header.vue';
import LeftSmallList from '../../PublicComponents/LeftSmallList.vue';
import { useAssistantStore } from '../../../stores/assistantStore';
import { assistantSquareData } from '../../../stores/assistantSquareData';

const themeOverrides = {
  common: {
    primaryColor: '#1e48f1', 
    primaryColorHover: '#1e48f1',
    primaryColorPressed: '#3D72D9',
  },
  button: {
    TextColor: '#1e48f1'
  },
};

export default defineComponent({
  name: 'AssistantSquareMainAssPage',
  components: { 
    Header, 
    LeftSmallList,
    NCard,
    NButton,
    NInput,
    NIcon,
    NAvatar,
    NTag,
    NSpace,
    NPagination,
    NConfigProvider
  },
  setup() {
    const assistantStore = useAssistantStore();
    
    return { 
      assistantStore,
      Search,
      themeOverrides,
      assistantSquareData
    };
  },
  data() {
    return {
      searchQuery: ''
    }
  },
  computed: {
    filteredAssistants() {
      return assistantSquareData.searchAssistants(this.searchQuery);
    }
  },
  methods: {
    addAssistant(assistant) {
      this.assistantStore.addAssistant(assistant);
      this.$message.success(`${assistant.name} 已添加到您的助手列表`);
    },
    viewAssistantDetails(assistant) {
      this.$router.push(`/assistant/${assistant.id}`);
    }
  }
});
</script>

<style scoped>
/* 可以添加一些自定义样式 */
</style>
