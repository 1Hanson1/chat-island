<template>
  <n-config-provider :theme-overrides="themeOverrides">
    <div class="h-screen flex flex-col">
      <Header />
      <div class="flex-1 overflow-hidden flex">
        <LeftSmallList />
        <div class="flex-1 p-5 overflow-auto">
          <NCard title="知识库" class="h-full">
            <div class="h-full flex">
              <div class="w-64 pr-5 border-r border-gray-300">
                <div class="mb-4">
                  <NButton type="primary" @click="showAddKbModal = true" :loading="loading">新建知识库</NButton>
                </div>
                <n-modal v-model:show="showAddKbModal">
                  <NCard
                    style="width: 500px"
                    title="新建知识库"
                    :bordered="false"
                    size="huge"
                    role="dialog"
                    aria-modal="true"
                  >
                    <n-form>
                      <n-form-item label="知识库名称">
                        <n-input v-model:value="newKbName" placeholder="请输入知识库名称" />
                      </n-form-item>
                      <n-form-item label="描述">
                        <n-input 
                          v-model:value="newKbDescription" 
                          placeholder="请输入描述"
                          type="textarea"
                        />
                      </n-form-item>
                      <n-form-item label="标签">
                        <n-dynamic-tags v-model:value="newKbTags" />
                      </n-form-item>
                      <n-button type="primary" @click="handleAddKnowledgeBase" :loading="loading">创建</n-button>
                    </n-form>
                  </NCard>
                </n-modal>
                <n-tree
                  :data="knowledgeBaseTreeData"
                  :render-label="renderTreeLabel"
                  selectable
                  @update:selected-keys="handleKbSelect"
                >
                </n-tree>
              </div>
              <div class="flex-1 pl-5">
                <div class="mb-4 flex gap-2">
                  <NButton type="primary" @click="showAddFileModal = true" :loading="loading">上传文件</NButton>
                  <NButton 
                    type="error" 
                    @click="handleRemoveKnowledgeBase(currentKnowledgeBase?.kid)"
                    :loading="loading"
                  >
                    删除知识库
                  </NButton>
                </div>
                <div class="mb-4 p-4 bg-gray-100 rounded">
                  <div class="mb-2">
                    <span class="font-medium">描述：</span>
                    <span>{{ currentKnowledgeBase?.description || '暂无描述' }}</span>
                  </div>
                  <div>
                    <span class="font-medium">标签：</span>
                    <n-space v-if="currentKnowledgeBase?.tags?.length > 0" size="small">
                      <n-tag
                        v-for="(tag, index) in currentKnowledgeBase?.tags"
                        :key="index"
                        type="info"
                      >
                        {{ tag }}
                      </n-tag>
                    </n-space>
                    <span v-else>暂无标签</span>
                  </div>
                </div>
                <n-modal v-model:show="showAddFileModal">
                  <NCard
                    style="width: 600px"
                    title="上传文件"
                    :bordered="false"
                    size="huge"
                    role="dialog"
                    aria-modal="true"
                  >
                    <n-upload
                      multiple
                      directory-dnd
                      :max="5"
                      @change="handleFileUpload"
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
                <n-data-table
                  :columns="fileColumns"
                  :data="currentKnowledgeBase?.documents || []"
                  :row-key="row => row.docid"
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
import { defineComponent, ref, computed, h, onMounted } from 'vue';
import Header from '../../PublicComponents/Header.vue';
import LeftSmallList from '../../PublicComponents/LeftSmallList.vue';
import { ArchiveOutline as ArchiveIcon, TrashOutline } from '@vicons/ionicons5'
import { useSourceGoDownStore } from '../../../stores/sourceGoDown'
import {
  NCard,
  NTree,
  NDataTable,
  NIcon,
  NForm,
  NFormItem,
  NInput,
  NButton,
  NModal,
  NUpload,
  NUploadDragger,
  NConfigProvider,
  NDynamicTags,
} from 'naive-ui';

export default defineComponent({
  name: 'SourceGoDownPage',
  components: {
    Header,
    LeftSmallList,
    NCard,
    NTree,
    NDataTable,
    NIcon,
    NForm,
    NFormItem,
    NInput,
    NButton,
    NModal,
    NUpload,
    NUploadDragger,
    NConfigProvider,
    NDynamicTags,
    ArchiveIcon,
    TrashOutline
  },
  setup() {
    const sourceGoDownStore = useSourceGoDownStore()
    const loading = ref(false)

    // 初始化数据
    onMounted(async () => {
      try {
        loading.value = true
        await sourceGoDownStore.fetchKnowledgeBases()
      } catch (error) {
        console.error('获取知识库列表失败:', error)
      } finally {
        loading.value = false
      }
    })
    
    const newKbName = ref('')
    const newKbDescription = ref('')
    const newKbTags = ref([])
    const showAddKbModal = ref(false)
    const showAddFileModal = ref(false)

    const knowledgeBaseTreeData = computed(() => {
      return sourceGoDownStore.knowledgeBases.map(kb => ({
        key: kb.kid,
        label: kb.name
      }))
    })

    const currentKnowledgeBase = computed(() => {
      return sourceGoDownStore.currentKnowledgeBase
    })

    const handleKbSelect = (keys: string[]) => {
      if (keys.length > 0) {
        sourceGoDownStore.selectedKnowledgeBaseId = keys[0]
      }
    }

    const handleAddKnowledgeBase = async () => {
      if (!newKbName.value.trim()) return
      
      try {
        loading.value = true
        await sourceGoDownStore.addKnowledgeBase(newKbName.value, newKbDescription.value, newKbTags.value)
        console.log('添加知识库成功')
        newKbName.value = ''
        newKbDescription.value = ''
        showAddKbModal.value = false
      } catch (error) {
        console.error('创建知识库失败:', error)
      } finally {
        loading.value = false
      }
    }

    const handleFileUpload = async ({ fileList }: { fileList: File[] }) => {
      if (!fileList || fileList.length === 0) return
      if (!sourceGoDownStore.selectedKnowledgeBaseId) {
        console.log('请先选择知识库')
        return
      }

      try {
        loading.value = true
        for (const file of fileList) {
          await sourceGoDownStore.addDocument(
            sourceGoDownStore.selectedKnowledgeBaseId,
            file.file
          )
        }
        console.log('文件上传成功')
        showAddFileModal.value = false
      } catch (error) {
        console.error('文件上传失败:', error)
      } finally {
        loading.value = false
      }
    }

    const handleRemoveKnowledgeBase = async (kid: string) => {
      if (kid === 'kb1') {
        console.log('默认知识库不可删除')
        return
      }
      
      try {
        loading.value = true
        await sourceGoDownStore.removeKnowledgeBase(kid)
        console.log('删除知识库成功')
      } catch (error) {
        console.error('删除知识库失败:', error)
      } finally {
        loading.value = false
      }
    }

    const renderTreeLabel = ({ option }: { option: any }) => {
      return option.label;
    };

    const fileColumns = [
      { title: '文件名', key: 'originalFilename' },
      { title: '文件类型', key: 'fileType' },
      {
        title: '操作',
        key: 'actions',
        render(row) {
          return h(NButton, {
            text: true,
            type: 'error',
            onClick: async () => {
              try {
                loading.value = true
                if (confirm('确认删除该文件吗？')) {
                  console.log('删除文件:', row.docId)
                  await sourceGoDownStore.removeDocument(
                    sourceGoDownStore.selectedKnowledgeBaseId,
                    row.docId
                  )
                  console.log('文件删除成功')
                }
              } catch (error) {
                console.error('文件删除失败:', error)
              } finally {
                loading.value = false
              }
            }
          }, {
            default: () => h(NIcon, null, { default: () => h(TrashOutline) })
          });
        }
      }
    ];

    const themeOverrides = {
      common: {
        primaryColor: '#1a73e8', 
        primaryColorHover: '#1a73e8',
        primaryColorPressed: '#0D47A1',
      },
    };

    return {
      knowledgeBaseTreeData,
      currentKnowledgeBase,
      newKbName,
      newKbDescription,
      showAddKbModal,
      showAddFileModal,
      fileColumns,
      handleRemoveKnowledgeBase,
      handleKbSelect,
      handleAddKnowledgeBase,
      handleFileUpload,
      renderTreeLabel,
      themeOverrides
    };
  }
});
</script>

<style scoped>

</style>
