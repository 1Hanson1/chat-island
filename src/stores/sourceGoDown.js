import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useSourceGoDownStore = defineStore('sourceGoDown', () => {
  // 知识库列表
  const knowledgeBases = ref([
    { 
      kid: 'kb1',
      name: '默认知识库',
      description: '系统默认知识库',
      documents: [
        { docid: 'doc1', name: '示例文档.pdf', type: '文档' },
        { docid: 'doc2', name: '示例图片.png', type: '图片' }
      ]
    }
  ])

  // 当前选中的知识库ID
  const selectedKnowledgeBaseId = ref('kb1')

  // 获取当前选中的知识库
  const currentKnowledgeBase = computed(() => {
    return knowledgeBases.value.find(kb => kb.kid === selectedKnowledgeBaseId.value)
  })

  // 添加新知识库
  const addKnowledgeBase = (name, description = '') => {
    const newKid = `kb${Date.now()}`
    knowledgeBases.value.push({
      kid: newKid,
      name,
      description,
      documents: []
    })
    return newKid
  }

  // 删除知识库
  const removeKnowledgeBase = (kid) => {
    knowledgeBases.value = knowledgeBases.value.filter(kb => kb.kid !== kid)
  }

  // 添加文档到知识库
  const addDocument = (kid, file) => {
    const kbIndex = knowledgeBases.value.findIndex(kb => kb.kid === kid)
    if (kbIndex !== -1) {
      const newDocId = `doc${Date.now()}`
      knowledgeBases.value[kbIndex].documents.push({
        docid: newDocId,
        name: file.name,
        type: file.type || '未知'
      })
      return newDocId
    }
  }

  // 删除文档
  const removeDocument = (kid, docid) => {
    const kbIndex = knowledgeBases.value.findIndex(kb => kb.kid === kid)
    if (kbIndex !== -1) {
      knowledgeBases.value[kbIndex].documents = 
        knowledgeBases.value[kbIndex].documents.filter(doc => doc.docid !== docid)
    }
  }

  return {
    knowledgeBases,
    selectedKnowledgeBaseId,
    currentKnowledgeBase,
    addKnowledgeBase,
    removeKnowledgeBase,
    addDocument,
    removeDocument
  }
})
