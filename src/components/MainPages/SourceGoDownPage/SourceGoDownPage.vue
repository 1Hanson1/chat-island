<template>
  <div class="knowledge-base-page">
    <Header />
    <div class="content-container">
      <LeftSmallList />
      <div class="main-content">
        <NCard title="文件库" class="file-manager-card">
          <div class="file-manager-container">
            <div class="sidebar">
              <NTabs type="line">
                <NTabPane name="categories" tab="文件类型">
                  <NTree
                    :data="fileCategorsies"
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
            <div class="file-content">
              <NTabs type="line">
                <NTabPane name="list" tab="列表视图">
                  <NDataTable
                    :columns="fileColumns"
                    :data="filteredFiles"
                    :row-key="row => row.id"
                  />
                </NTabPane>
                <NTabPane name="grid" tab="网格视图">
                  <div class="file-grid">
                    <div v-for="file in filteredFiles" :key="file.id" class="file-item">
                      <NIcon :component="getFileIcon(file.type)" size="24" />
                      <span>{{ file.name }}</span>
                    </div>
                  </div>
                </NTabPane>
              </NTabs>
            </div>
          </div>
        </NCard>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import Header from '../../PublicComponents/Header.vue';
import LeftSmallList from '../../PublicComponents/LeftSmallList.vue';
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
  NButton
} from 'naive-ui';
import {
  DocumentTextOutline,
  FolderOutline,
  ImageOutline,
  VideocamOutline,
  MusicalNotesOutline
} from '@vicons/ionicons5';

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
    NButton
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
      { id: 1, name: 'document.pdf', type: '文档', category: '文档', group: '分组1' },
      { id: 2, name: 'image.png', type: '图片', category: '图片', group: '分组2' },
      { id: 3, name: 'video.mp4', type: '视频', category: '视频', group: '分组1' },
      { id: 4, name: 'audio.mp3', type: '音频', category: '音频', group: '分组3' }
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

    const handleCategorySelect = (keys: string[]) => {
      selectedCategory.value = keys;
    };

    const handleGroupSelect = (keys: string[]) => {
      selectedGroup.value = keys;
    };

    const renderTreeLabel = ({ option }: { option: any }) => {
      return option.label;
    };

    const getFileIcon = (type: string) => {
      switch (type) {
        case 'document': return DocumentTextOutline;
        case 'folder': return FolderOutline;
        case 'image': return ImageOutline;
        case 'video': return VideocamOutline;
        case 'audio': return MusicalNotesOutline;
        default: return DocumentTextOutline;
      }
    };

    const fileColumns = [
      { title: '文件名', key: 'name' },
      { title: '文件类型', key: 'type' },
      { title: '文件分组', key: 'group' },
    ];

    return {
      fileCategories,
      fileGroups,
      filteredFiles,
      selectedCategory,
      selectedGroup,
      handleCategorySelect,
      handleGroupSelect,
      renderTreeLabel,
      getFileIcon,
      fileColumns
    };
  }
});
</script>

<style scoped>
.knowledge-base-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.content-container {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.main-content {
  flex: 1;
  padding: 20px;
  overflow: auto;
}

.file-manager-card {
  height: 100%;
}

.file-manager-container {
  display: flex;
  height: 100%;
}

.sidebar {
  width: 250px;
  padding-right: 20px;
  border-right: 1px solid #eee;
}

.file-content {
  flex: 1;
  padding-left: 20px;
}

.file-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 16px;
}

.file-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  border: 1px solid #eee;
  border-radius: 4px;
  cursor: pointer;
}

.file-item:hover {
  background-color: #f5f5f5;
}
</style>
