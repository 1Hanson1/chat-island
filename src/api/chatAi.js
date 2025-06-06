import axios from 'axios';

const baseURL = 'http://47.117.107.1645:8113/api';
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
 * 
 * @param {
 * sessionId: string,
 * msg: string,
 * model: string,
 * } param0 
 * @returns {
 * sessionId: string,
 * msg: string,
 * model: string,
 * }
 */
export function streamChat({ sessionId, msg, model }) {
  return instance.post('/chat/stream-test', { sessionId, msg, model });
}

export function createSession() {
  return instance.post('/chat/session/create');
}

export function chatWithKnowledge({ sessionId, msg, kid, model }) {
  return instance.post('/chat/say', { sessionId, msg, kid, model });
}

export function clearSession({ sessionId }) {
  return instance.delete('/chat/session/clear', { data: { sessionId } });
}

export function renameSession({ sessionId, name }) {
  return instance.put(`/chat/sessions/${sessionId}/rename`, { name });
}

export function getUserSessions({ uid, sessionId }) {
  return instance.get(`/chat/session/${uid}/${sessionId}`);
}

export function deleteSession({ sessionId }) {
  return instance.delete(`/chat/session/${sessionId}`);
}

export function getAllSessions(uid) {
  return instance.get(`/chat/session/${uid}`);
}

export function submitHelpMessage({ uid, msg }) {
  return instance.post('/help/chat', { uid, msg });
}

export function getUserInquiries(uid) {
  return instance.get('/help/inquiries', { params: { uid } });
}

export function getCustomerInquiries(uid) {
  return instance.get('/help/inquiries4cs', { params: { uid } });
}

export function completeInquiry({ csUid, inquiryId, replyMsg }) {
  return instance.post('/help/complete', { csUid, inquiryId, replyMsg });
}
