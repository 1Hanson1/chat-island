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
                  <NButton type="primary" @click="showAddKbModal = true">新建知识库</NButton>
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
                      <n-button type="primary" @click="handleAddKnowledgeBase">创建</n-button>
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
                  <NButton type="primary" @click="showAddFileModal = true">上传文件</NButton>
                  <NButton 
                    type="error" 
                    @click="handleRemoveKnowledgeBase(currentKnowledgeBase?.kid)"
                  >
                    删除知识库
                  </NButton>
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
import { defineComponent, ref, computed, h } from 'vue';
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
    ArchiveIcon,
    TrashOutline
  },
  setup() {
    const sourceGoDownStore = useSourceGoDownStore()
    
    const newKbName = ref('')
    const newKbDescription = ref('')
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

    const handleAddKnowledgeBase = () => {
      if (newKbName.value.trim()) {
        sourceGoDownStore.addKnowledgeBase(newKbName.value, newKbDescription.value)
        newKbName.value = ''
        newKbDescription.value = ''
        showAddKbModal.value = false
      }
    }

    const handleFileUpload = ({ fileList }: { fileList: File[] }) => {
      if (sourceGoDownStore.selectedKnowledgeBaseId) {
        fileList.forEach(file => {
          sourceGoDownStore.addDocument(
            sourceGoDownStore.selectedKnowledgeBaseId,
            file
          )
        })
      }
    }

    const handleRemoveKnowledgeBase = (kid: string) => {
      if (kid === 'kb1') {
        console.log('不能删除默认知识库')
        return
      }
      sourceGoDownStore.removeKnowledgeBase(kid)
      if (sourceGoDownStore.selectedKnowledgeBaseId === kid) {
        sourceGoDownStore.selectedKnowledgeBaseId = 'kb1'
      }
      console.log('知识库删除成功')
    }

    const renderTreeLabel = ({ option }: { option: any }) => {
      return option.label;
    };

    const fileColumns = [
      { title: '文件名', key: 'name' },
      { title: '文件类型', key: 'type' },
      {
        title: '操作',
        key: 'actions',
        render(row) {
          return h(NButton, {
            text: true,
            type: 'error',
            onClick: () => {
              if (window.confirm('确定要删除这个文件吗？')) {
                sourceGoDownStore.removeDocument(
                  sourceGoDownStore.selectedKnowledgeBaseId,
                  row.docid
                );
                console.log('文件删除成功');
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
