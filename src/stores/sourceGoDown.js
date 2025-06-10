import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { 
  createKnowledge,
  listKnowledge,
  getKnowledgeInfo,
  deleteKnowledge,
  uploadDocument,
  deleteDocument
} from '../api/knowledge'
import { create } from 'naive-ui'

export const useSourceGoDownStore = defineStore('sourceGoDown', () => {
  // 知识库列表
  const knowledgeBases = ref([])

  // 当前选中的知识库ID
  const selectedKnowledgeBaseId = ref('kb_1')

  // 获取知识库列表
  const fetchKnowledgeBases = async () => {
    try {
      const uid = localStorage.getItem('uid')
      const { data } = await listKnowledge({ uid })
      
      knowledgeBases.value = data.data.map(kb => ({
        kid: kb.kid || '',
        name: kb.name || '未命名知识库',
        description: kb.description || '',
        documents: Array.isArray(kb.documents) ? kb.documents : []
      }))
      console.log('知识库列表:', knowledgeBases.value)
      // 保留当前选中的知识库，如果没有则选择第一个
      if (!selectedKnowledgeBaseId.value && knowledgeBases.value.length > 0) {
        selectedKnowledgeBaseId.value = knowledgeBases.value[0].kid
      }
    } catch (error) {
    }
  }

  // 获取当前选中的知识库
  const currentKnowledgeBase = computed(() => {
    return knowledgeBases.value.find(kb => kb.kid === selectedKnowledgeBaseId.value)
  })

  // 添加新知识库
  const addKnowledgeBase = async (name, description = '', tags = []) => {
    try {
      const uid = localStorage.getItem('uid') 
      const response = await createKnowledge({ name, description, tags, uid })
      const newKb = response.data
      console.log('创建知识库成功:', newKb)
      knowledgeBases.value.push({
        kid: newKb.kid,
        name: newKb.name,
        description: newKb.description,
        documents: []
      })
      return newKb.kid
    } catch (error) {
      console.error('创建知识库失败:', error)
      throw error
    }
  }

  // 删除知识库
  const removeKnowledgeBase = async (kid) => {
    try {
      const uid = localStorage.getItem('uid')
      await deleteKnowledge({ kid, uid })
      
      // 更新本地状态
      knowledgeBases.value = knowledgeBases.value.filter(kb => kb.kid !== kid)
      
      // 如果删除的是当前选中的知识库，则重置选中状态
      if (selectedKnowledgeBaseId.value === kid) {
        selectedKnowledgeBaseId.value = knowledgeBases.value[0]?.kid || ''
      }
    } catch (error) {
      console.error('删除知识库失败:', error)
      throw error
    }
  }

  // 添加文档到知识库
  const addDocument = async (kid, file) => {
    try {
      const uid = localStorage.getItem('uid')
      const response = await uploadDocument({ kid, uid, file })
      
      // 更新本地状态
      const kbIndex = knowledgeBases.value.findIndex(kb => kb.kid === kid)
      if (kbIndex !== -1) {
        const newDocument = {
          docid: response.data.docId,
          originalFilename: file.name,
          fileType: file.type
        }
        knowledgeBases.value[kbIndex].documents.push(newDocument)
      }
      
      return response.data
    } catch (error) {
      console.error('上传文档失败:', error)
      throw error
    }
  }

  // 删除文档
  const removeDocument = async (kid, docid) => {
    try {
      await deleteDocument({ docId: docid })
      
      const kbIndex = knowledgeBases.value.findIndex(kb => kb.kid === kid)
      if (kbIndex !== -1) {
        knowledgeBases.value[kbIndex].documents = 
          knowledgeBases.value[kbIndex].documents.filter(doc => doc.docid !== docid)
      }
    } catch (error) {
      console.error('删除文档失败:', error)
      throw error
    }
  }

  return {
    knowledgeBases,
    selectedKnowledgeBaseId,
    currentKnowledgeBase,
    addKnowledgeBase,
    removeKnowledgeBase,
    addDocument,
    removeDocument,
    fetchKnowledgeBases
  }
})
