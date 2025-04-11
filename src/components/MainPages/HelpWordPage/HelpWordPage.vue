<template>
  <div class="flex flex-col h-screen">
    <Header />
    <div class="flex flex-1">
      <LeftSmallList />
      <div class="help-container flex h-full w-full">
        <!-- 左侧导航栏 -->
        <n-card
          class="w-64 p-0 overflow-y-auto"
          content-style="padding:0"
          :bordered="false"
        >
          <n-menu
            :options="menuOptions"
            :default-expanded-keys="defaultExpandedKeys"
            @update:value="handleMenuSelect"
          />
        </n-card>

        <!-- 右侧内容区 -->
        <div class="flex-1 overflow-auto w-full">
          <n-card
            v-if="markdownContent"
            class="h-full w-full"
            content-style="padding:2rem;height:100%;width:100%;display:flex;flex-direction:column"
          >
            <template #header>
              <n-h1>{{ currentTitle }}</n-h1>
            </template>
            <n-spin v-if="loading" size="large" />
            <div v-else class="markdown-body " v-html="compiledMarkdown"></div>
          </n-card>
          <n-empty
            v-else
            class="h-full flex items-center justify-center"
            description="请从左侧选择要查看的帮助内容"
          />
        </div>
      </div>
    </div>
  </div>
  
</template>

<script >
import { ref, computed, h } from 'vue'
import { marked } from 'marked'
import {
  NMenu,
  NCard,
  NEmpty,
  NSpin,
  NH1,
  NConfigProvider
} from 'naive-ui'
import Header from '../../PublicComponents/Header.vue'
import LeftSmallList from '../../PublicComponents/LeftSmallList.vue'

export default {
  components: {
    Header,
    LeftSmallList,
    NMenu,
    NCard,
    NEmpty,
    NSpin,
    NH1,
    NConfigProvider
  },
  setup() {
    
    const sections = ref([
      {
        title: '主要问题',
        items: [
          { title: '账号注册', file: 'register' },
          { title: '登录问题', file: 'login' },
          { title: '支付问题', file: 'payment' }
        ]
      },
      {
        title: '其他问题',
        items: [
          { title: '隐私政策', file: 'privacy' },
          { title: '使用条款', file: 'terms' }
        ]
      },
      {
        title: '提出问题',
        items: [
          { title: '联系客服', file: 'contact' },
          { title: '反馈建议', file: 'feedback' }
        ]
      }
    ])

    // 转换为NMenu需要的格式
    const menuOptions = computed(() => {
      return sections.value.map((section, index) => ({
        label: section.title,
        key: `section-${index}`,
        type: 'group',
        children: section.items.map((item, itemIndex) => ({
          label: item.title,
          key: `${index}-${itemIndex}`,
          file: item.file
        }))
      }))
    })

    const defaultExpandedKeys = ref(['section-0'])
    const markdownContent = ref('')
    const loading = ref(false)
    const currentTitle = ref('')

    async function loadMarkdown(fileName, title) {
      loading.value = true
      currentTitle.value = title
      try {
        const response = await fetch(`/markdown/${fileName}.md`)
        if (response.ok) {
          markdownContent.value = await response.text()
        } else {
          markdownContent.value = '# 内容加载失败\n请稍后再试或联系客服'
        }
      } catch (error) {
        markdownContent.value = '# 内容加载出错\n请检查网络连接'
      } finally {
        loading.value = false
      }
    }

    function handleMenuSelect(key, item) {
      if (item.file) {
        loadMarkdown(item.file, item.label)
      }
    }

    const compiledMarkdown = computed(() => {
      return marked(markdownContent.value)
    })

    return {
      menuOptions,
      defaultExpandedKeys,
      markdownContent,
      compiledMarkdown,
      loading,
      currentTitle,
      handleMenuSelect
    }
  }
}
</script>

<style scoped>
.help-container {
  height: calc(100vh - 64px); /* 减去可能的header高度 */
}

.markdown-body {
  text-align: left;
  padding-left: 2rem;
}

</style>
  