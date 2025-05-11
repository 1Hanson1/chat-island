<template>
  <n-config-provider :theme-overrides="themeOverrides">
    <div class="h-screen flex flex-col">
      <Header />
      <div class="flex-1 overflow-hidden flex">
        <LeftSmallList />
        <div class="flex-1 p-5 overflow-auto">
          <NCard title="文件库" class="h-full">
            <div class="h-full flex">
              <div class="w-64 pr-5 border-r border-gray-300">
                <NTabs type="line">
                  <NTabPane name="categories" tab="文件类型">
                    <NTree
                      :data="fileCategories"
                      :render-label="renderTreeLabel"
                      selectable
                      @update:selected-keys="handleCategorySelect"
                    />
                  </NTabPane>
                  <NTabPane name="groups" tab="文件分组">
                    <NTree
                      :data="fileGroups"
                      :render-label="renderTreeLabel"
                      selectable
                      @update:selected-keys="handleGroupSelect"
                    />
                  </NTabPane>
                </NTabs>
              </div>
              <div class="flex-1 pl-5">
                <div class="mb-4">
                  <NButton type="primary" @click="showAddFileModal = true">添加文件</NButton>
                </div>
                <n-modal v-model:show="showAddFileModal">
                  <NCard
                    style="width: 600px"
                    title="添加新文件"
                    :bordered="false"
                    size="huge"
                    role="dialog"
                    aria-modal="true"
                  >
                    <n-upload
                      multiple
                      directory-dnd
                      :max="5"
                    >
                      <n-upload-dragger>
                        <div style="margin-bottom: 12px">
                          <n-icon size="48" :depth="3">
                            <ArchiveIcon />
                          </n-icon>
                        </div>
                        <n-text style="font-size: 16px">
                          点击或者拖动文件到该区域来上传
                        </n-text>
                      </n-upload-dragger>
                    </n-upload>
                  </NCard>
                </n-modal>
                <n-data-Table
                  :columns="fileColumns"
                  :data="filteredFiles"
                  :row-key="row => row.id"
                />
              </div>
            </div>
          </NCard>
        </div>
      </div>
    </div>
  </n-config-provider>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import Header from '../../PublicComponents/Header.vue';
import LeftSmallList from '../../PublicComponents/LeftSmallList.vue';
import { ArchiveOutline as ArchiveIcon } from '@vicons/ionicons5'
import {
  NCard,
  NTree,
  NTabs,
  NTabPane,
  NDataTable,
  NIcon,
  NForm,
  NFormItem,
  NInput,
  NButton,
  NModal,
  NSelect,
  NUpload,
  NUploadDragger,
  NConfigProvider
} from 'naive-ui';

export default defineComponent({
  name: 'KnowledgeBasePage',
  components: {
    Header,
    LeftSmallList,
    NCard,
    NTree,
    NTabs,
    NTabPane,
    NDataTable,
    NIcon,
    NForm,
    NFormItem,
    NInput,
    NButton,
    NModal,
    NSelect,
    NUpload,
    NUploadDragger,
    NConfigProvider,
    ArchiveIcon
  },
  setup() {
    const fileCategories = ref([
      { key: '文档', label: '文档' },
      { key: '图片', label: '图片' },
      { key: '视频', label: '视频' },
      { key: '音频', label: '音频' }
    ]);

    const fileGroups = ref([
      { key: '分组1', label: '分组1' },
      { key: '分组2', label: '分组2' },
      { key: '分组3', label: '分组3' }
    ]);

    const files = ref([
      { name: 'document.pdf', type: '文档', category: '文档', group: '分组1' },
      { name: 'image.png', type: '图片', category: '图片', group: '分组2' },
      { name: 'video.mp4', type: '视频', category: '视频', group: '分组1' },
      { name: 'audio.mp3', type: '音频', category: '音频', group: '分组3' }
    ]);

    const selectedCategory = ref<string[]>([]);
    const selectedGroup = ref<string[]>([]);

    const filteredFiles = computed(() => {
      return files.value.filter(file => {
        const categoryMatch = selectedCategory.value.length === 0 || 
          selectedCategory.value.includes(file.category);
        const groupMatch = selectedGroup.value.length === 0 || 
          selectedGroup.value.includes(file.group);
        return categoryMatch && groupMatch;
      });
    });


    const fileColumns = [
      { title: '文件名', key: 'name' },
      { title: '文件类型', key: 'type' },
      { title: '文件分组', key: 'group' },
    ];

    const handleCategorySelect = (keys: string[]) => {
      selectedCategory.value = keys;
    };

    const handleGroupSelect = (keys: string[]) => {
      selectedGroup.value = keys;
    };

    const renderTreeLabel = ({ option }: { option: any }) => {
      return option.label;
    };
  
    const showAddFileModal = ref(false);

    const themeOverrides = {
      common: {
        primaryColor: '#1a73e8', 
        primaryColorHover: '#1a73e8',
        primaryColorPressed: '#0D47A1',
      },
    };

    return {
      fileCategories,
      fileGroups,
      filteredFiles,
      selectedCategory,
      selectedGroup,
      fileColumns,
      handleCategorySelect,
      handleGroupSelect,
      renderTreeLabel,
      showAddFileModal,
      themeOverrides
    };
  }
});
</script>

<style scoped>

</style>
