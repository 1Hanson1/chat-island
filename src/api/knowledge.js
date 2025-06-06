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

export function listKnowledge({ uid }) {
  return instance.get('/list', { params: { uid } });
}

export function createKnowledge({ name, description, tags, uid }) {
  return instance.post('/new', { name, description, tags }, { params: { uid } });
}

export function getKnowledgeInfo({ kid, uid }) {
  return instance.get('/info', { params: { kid, uid } });
}

export function deleteKnowledge({ kid, uid }) {
  return instance.delete('/delete-kb', { params: { kid, uid } });
}

export function deleteDocument({ docId }) {
  return instance.delete('/delete-doc', { params: { docId } });
}

export function deleteAllKnowledge({ uid }) {
  return instance.delete('/delete-all', { params: { uid } });
}

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

export function searchKnowledge({ uid, kid, question, maxResults = 3, minScore = 0.7 }) {
  return instance.post('/search', { uid, kid, question, maxResults, minScore });
}
