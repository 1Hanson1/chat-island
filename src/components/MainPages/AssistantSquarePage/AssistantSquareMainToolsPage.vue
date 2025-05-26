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
            <h1 class="text-2xl font-bold">工具列表</h1>
          </div>
          
          <!-- 搜索区域 -->
          <div class="mb-6">
            <n-input
              v-model:value="searchQuery"
              placeholder="搜索工具..."
              clearable
              round
            >
              <template #prefix>
                <n-icon :component="Search" />
              </template>
            </n-input>
          </div>

          <!-- 工具列表 -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <n-card
              v-for="tool in filteredTools"
              :key="tool.id"
              :title="tool.name"
              hoverable
              embedded
              :bordered="false"
              class="cursor-pointer transition-all hover:scale-[1.02]"
              @click="viewToolDetails(tool)"
            >
              <div class="flex items-start gap-3">
                <n-avatar
                  round
                  :style="{ backgroundColor: '#eff6ff', color: '#3b82f6' }"
                  size="large"
                >
                  {{ tool.name.charAt(0) }}
                </n-avatar>
                <div>
                  <p class="text-gray-500 text-sm">{{ tool.description }}</p>
                  <n-space :size="[4, 4]" class="mt-2">
                    <n-tag
                      v-for="tag in tool.tags"
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
                  @click.stop="addTool(tool)"
                >
                  添加工具
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
  name: 'AssistantSquareMainToolsPage',
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
      themeOverrides
    };
  },
  data() {
    return {
      searchQuery: '',
      tools: [
        {
          id: 1,
          name: 'PDF转换',
          description: 'PDF文件转换和编辑工具',
          tags: ['PDF', '转换']
        },
        {
          id: 2,
          name: '图片处理',
          description: '在线图片编辑和优化',
          tags: ['图片', '编辑']
        },
        {
          id: 3,
          name: '翻译插件',
          description: '多语言实时翻译工具',
          tags: ['翻译', '语言']
        },
        {
          id: 4,
          name: '代码格式化',
          description: '代码格式化和美化工具',
          tags: ['代码', '开发']
        },
        {
          id: 5,
          name: '数据可视化',
          description: '创建数据图表和可视化',
          tags: ['数据', '图表']
        },
        {
          id: 6,
          name: '视频压缩',
          description: '在线视频压缩和转换',
          tags: ['视频', '压缩']
        }
      ]
    }
  },
  computed: {
    filteredTools() {
      if (!this.searchQuery) return this.tools;
      const query = this.searchQuery.toLowerCase();
      return this.tools.filter(t => 
        t.name.toLowerCase().includes(query) || 
        t.description.toLowerCase().includes(query) ||
        t.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
  },
  methods: {
    addTool(tool) {
      const assistant = {
        name: tool.name,
        description: tool.description,
        tags: tool.tags
      };
      this.assistantStore.addAssistant(assistant);
      this.$message.success(`${tool.name} 已添加到您的助手列表`);
    },
    viewToolDetails(tool) {
      this.$message.info(`查看 ${tool.name} 的详细信息`);
    }
  }
});
</script>

<style scoped>
/* 可以添加一些自定义样式 */
</style>
