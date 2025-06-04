<template>
  <n-config-provider :theme-overrides="themeOverrides">
    <div class="flex flex-col h-screen">
      <Header />
      <div class="flex flex-1">
        <LeftSmallList />
        <div class="flex-1 p-6 overflow-auto">
        <n-card title="快速创建助手" class="max-w-3xl mx-auto">
          <n-tabs type="line">
            <n-tab-pane name="basic" tab="基本设置">
              <n-form ref="formRef" :model="formData">
                <n-form-item label="助手名称" path="name" required>
                  <n-input v-model:value="formData.name" placeholder="请输入助手名称" />
                </n-form-item>
                <n-form-item label="助手描述" path="description">
                  <n-input
                    v-model:value="formData.description"
                    type="textarea"
                    placeholder="请输入助手描述"
                    :autosize="{ minRows: 3, maxRows: 5 }"
                  />
                </n-form-item>
                <n-form-item label="标签" path="tags">
                  <n-dynamic-tags v-model:value="formData.tags" />
                </n-form-item>
              </n-form>
            </n-tab-pane>

            <n-tab-pane name="advanced" tab="高级设置">
              <n-form-item label="JSON输入格式">
                <n-input
                  v-model:value="formData.inputFormat"
                  type="textarea"
                  placeholder="输入JSON格式要求"
                  :autosize="{ minRows: 3, maxRows: 5 }"
                />
              </n-form-item>
              <n-form-item label="JSON输出格式">
                <n-input
                  v-model:value="formData.outputFormat"
                  type="textarea"
                  placeholder="输出JSON格式要求"
                  :autosize="{ minRows: 3, maxRows: 5 }"
                />
              </n-form-item>
              <n-form-item label="上下文记忆长度">
                <n-input-number v-model:value="formData.contextLength" :min="1" :max="10" />
              </n-form-item>
            </n-tab-pane>

            <n-tab-pane name="prompts" tab="预设语料">
              <n-form-item label="系统提示词">
                <n-input
                  v-model:value="formData.presetPrompts.systemPrompt"
                  type="textarea"
                  placeholder="输入系统提示词"
                  :autosize="{ minRows: 3, maxRows: 5 }"
                />
              </n-form-item>
              <n-form-item label="对话引导">
                <n-dynamic-input
                  v-model:value="formData.presetPrompts.conversationStarters"
                  :on-create="() => ''"
                  placeholder="输入对话引导语"
                  :min="1"
                  :max="10"
                />
              </n-form-item>
              <n-form-item label="上下文示例">
                <n-dynamic-input
                  v-model:value="formData.presetPrompts.contextExamples"
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

          <div class="flex justify-end mt-6 space-x-4">
            <n-button @click="resetForm">重置</n-button>
            <n-button type="primary" @click="createAssistant">创建助手</n-button>
          </div>
        </n-card>
      </div>
    </div>
    </div>
  </n-config-provider>
</template>

<script>
import { defineComponent, ref } from 'vue';
import { 
  NButton, 
  NForm,
  NFormItem,
  NInput,
  NInputNumber,
  NDynamicTags,
  NTabs,
  NTabPane,
  NCard,
  NConfigProvider,
  NDynamicInput,
  useMessage
} from 'naive-ui';

const themeOverrides = {
  common: {
    primaryColor: '#1e88e5',
    primaryColorHover: '#1976d2',
    primaryColorPressed: '#1565c0',
    primaryColorSuppl: '#0d47a1'
  },
  Button: {
    textColor: '#1e88e5',
    textColorHover: '#1976d2',
    textColorPressed: '#1565c0',
    textColorFocus: '#0d47a1'
  }
};
import Header from '../../PublicComponents/Header.vue';
import LeftSmallList from '../../PublicComponents/LeftSmallList.vue';
import { useAssistantStore } from '../../../stores/assistantStore';

export default defineComponent({
  name: 'QuickCreateAssistantPage',
  components: { 
    Header,
    LeftSmallList,
    NButton,
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
    const assistantStore = useAssistantStore();
    const formRef = ref(null);
    
    const formData = ref({
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

    const resetForm = () => {
      formData.value = {
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
      };
    };

    const createAssistant = () => {
      if (!formData.value.name) {
        message.error('请输入助手名称');
        return;
      }

      const newAssistant = {
        id: Date.now(),
        name: formData.value.name,
        description: formData.value.description,
        tags: formData.value.tags,
        inputFormat: formData.value.inputFormat,
        outputFormat: formData.value.outputFormat,
        contextLength: formData.value.contextLength,
        presetPrompts: {
          systemPrompt: formData.value.presetPrompts.systemPrompt,
          conversationStarters: [...formData.value.presetPrompts.conversationStarters],
          contextExamples: [...formData.value.presetPrompts.contextExamples]
        },
        historys: []
      };

      assistantStore.addAssistant(newAssistant);
      resetForm();
    };

    return {
      themeOverrides,
      formRef,
      formData,
      resetForm,
      createAssistant
    };
  }
});
</script>

<style scoped></style>
  