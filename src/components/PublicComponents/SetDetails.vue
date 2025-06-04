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
            <h1 class="text-2xl font-bold">{{ assistant.name || '助手' }}设置</h1>
          </div>

          <n-card>
            <n-tabs type="line">
              <n-tab-pane name="basic" tab="基本设置">
                <n-form ref="formRef" :model="settings">
                  <n-form-item label="助手名称" path="name">
                    <n-input v-model:value="settings.name" placeholder="请输入助手名称" />
                  </n-form-item>
                  <n-form-item label="助手描述" path="description">
                    <n-input
                      v-model:value="settings.description"
                      type="textarea"
                      placeholder="请输入助手描述"
                      :autosize="{
                        minRows: 3,
                        maxRows: 5
                      }"
                    />
                  </n-form-item>
                  <n-form-item label="标签" path="tags">
                    <n-dynamic-tags v-model:value="settings.tags" />
                  </n-form-item>
                </n-form>
              </n-tab-pane>

              <n-tab-pane name="advanced" tab="高级设置">
                <n-form-item label="JSON输入格式">
                  <n-input
                    v-model:value="settings.inputFormat"
                    type="textarea"
                    placeholder="输入JSON格式要求"
                    :autosize="{
                      minRows: 3,
                      maxRows: 5
                    }"
                  />
                </n-form-item>
                <n-form-item label="JSON输出格式">
                  <n-input
                    v-model:value="settings.outputFormat"
                    type="textarea"
                    placeholder="输出JSON格式要求"
                    :autosize="{
                      minRows: 3,
                      maxRows: 5
                    }"
                  />
                </n-form-item>
                <n-form-item label="上下文记忆长度">
                  <n-input-number v-model:value="settings.contextLength" :min="1" :max="10" />
                </n-form-item>
              </n-tab-pane>

              <n-tab-pane name="prompts" tab="预设语料">
                <n-form-item label="系统提示词">
                  <n-input
                    v-model:value="settings.presetPrompts.systemPrompt"
                    type="textarea"
                    placeholder="输入系统提示词"
                    :autosize="{
                      minRows: 3,
                      maxRows: 5
                    }"
                  />
                </n-form-item>
                <n-form-item label="对话引导">
                  <n-dynamic-input
                    v-model:value="settings.presetPrompts.conversationStarters"
                    :on-create="() => ''"
                    placeholder="输入对话引导语"
                    :min="1"
                    :max="10"
                  />
                </n-form-item>
                <n-form-item label="上下文示例">
                  <n-dynamic-input
                    v-model:value="settings.presetPrompts.contextExamples"
                    :on-create="() => ({input: '', output: ''})"
                    placeholder="添加上下文示例"
                    :min="1"
                    :max="10"
                  >
                    <template #default="{ value, index }">
                      <div class="flex space-x-2">
                        <n-input v-model:value="value.input" placeholder="输入" />
                        <n-input v-model:value="value.output" placeholder="输出" />
                      </div>
                    </template>
                  </n-dynamic-input>
                </n-form-item>
              </n-tab-pane>
            </n-tabs>

            <div class="flex justify-end mt-6">
              <n-button type="primary" @click="saveSettings">保存设置</n-button>
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
  NForm,
  NFormItem,
  NInput,
  NInputNumber,
  NDynamicTags,
  NTabs,
  NTabPane,
  NCard,
  NConfigProvider,
  NDynamicInput
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
  name: 'SetDetails',
  components: { 
    Header,
    LeftSmallList,
    NButton,
    NIcon,
    NForm,
    NFormItem,
    NInput,
    NInputNumber,
    NDynamicTags,
    NTabs,
    NTabPane,
    NCard,
    NConfigProvider,
    NDynamicInput
  },
  setup() {
    const route = useRoute();
    const assistantStore = useAssistantStore();
    const assistant = ref({});
    const settings = ref({
      name: '',
      description: '',
      tags: [],
      inputFormat: '',
      outputFormat: '',
      contextLength: 3,
      presetPrompts: {
        systemPrompt: '',
        conversationStarters: [],
        contextExamples: []
      }
    });

    onMounted(() => {
      const id = parseInt(route.params.id);
      const foundAssistant = assistantSquareData.allAssistants.find(a => a.id === id) || 
                           assistantStore.assistants.find(a => a.id === id);
      
      if (foundAssistant) {
        assistant.value = foundAssistant;
        settings.value = {
          name: foundAssistant.name,
          description: foundAssistant.description,
          tags: foundAssistant.tags || [],
          inputFormat: foundAssistant.inputFormat || '',
          outputFormat: foundAssistant.outputFormat || '',
          contextLength: foundAssistant.contextLength || 3,
          presetPrompts: foundAssistant.presetPrompts || {
            systemPrompt: '',
            conversationStarters: [],
            contextExamples: []
          }
        };
      }
    });

    const saveSettings = () => {
      // 更新助手数据
      if (assistant.value.id) {
        assistant.value.name = settings.value.name;
        assistant.value.description = settings.value.description;
        assistant.value.tags = settings.value.tags;
        assistant.value.inputFormat = settings.value.inputFormat;
        assistant.value.outputFormat = settings.value.outputFormat;
        assistant.value.contextLength = settings.value.contextLength;
        assistant.value.presetPrompts = settings.value.presetPrompts;
        
        // 这里可以添加保存到服务器的逻辑
        console.log('设置已保存:', settings.value);
      }
    };

    return {
      assistantStore,
      themeOverrides,
      assistant,
      settings,
      saveSettings
    };
  }
});
</script>
