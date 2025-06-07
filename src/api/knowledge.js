import axios from 'axios';

const baseURL = 'http://47.117.107.164:8113/api/knowledge';
const instance = axios.create({
  baseURL,
});

// 请求拦截器：自动添加 JWT token
instance.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

/**
 * 知识库管理API
 * 所有接口都需要在请求头中携带Authorization字段，格式为Bearer <token>
 */

// 1. 创建新知识库
export function createKnowledge({ name, description, tags, uid }) {
  return instance.post('/new', { name, description, tags }, { params: { uid } });
}

// 2. 获取用户所有知识库信息
export function listKnowledge({ uid }) {
  return instance.get('/list', { params: { uid } });
}

// 3. 获取特定知识库详细信息
export function getKnowledgeInfo({ kid, uid }) {
  return instance.get('/info', { params: { kid, uid } });
}

// 4. 删除特定知识库
export function deleteKnowledge({ kid, uid }) {
  return instance.delete('/delete-kb', { params: { kid, uid } });
}

// 5. 删除知识库中的特定文档
export function deleteDocument({ docId }) {
  return instance.delete('/delete-doc', { params: { docId } });
}

// 6. 文档上传接口（支持txt/pdf/doc/docx/md/html/htm格式）
export function uploadDocument({ kid, uid, file }) {
  const formData = new FormData();
  formData.append('file', file);
  
  return instance.post('/upload', formData, { 
    params: { kid, uid },
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
}

// 7. 知识检索接口
export function searchKnowledge({ uid, kid, question, maxResults = 3, minScore = 0.7 }) {
  return instance.post('/search', { kid, question, maxResults, minScore }, { params: { uid } });
}

// 8. 删除用户所有知识库
export function deleteAllKnowledge({ uid }) {
  return instance.delete('/delete-all', { params: { uid } });
}
