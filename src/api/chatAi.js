import axios from 'axios';

const baseURL = 'http://172.20.10.13:8113/api';
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
 * 聊天API
 * 所有接口都需要在请求头中携带Authorization字段，格式为Bearer <token>
 */

// 1. 流式对话测试
export function streamChat({ sessionId = "000001", msg = "你是谁", model = "qwen-turbo" }) {
  return instance.post('/chat/stream-test', { sessionId, msg, model }, {
    responseType: 'stream'
  });
}

// 2. 创建新会话
export function createSession() {
  return instance.post('/chat/session/create');
}

// 3. 发送知识增强流式消息
export function chatWithKnowledge({ 
  sessionId = "000001", 
  msg = "你是谁", 
  kid, 
  model = "qwen-turbo" 
}) {
  return instance.post('/chat/say', { sessionId, msg, kid, model });
}

// 4. 清理聊天记录
export function clearSession({ sessionId }) {
  return instance.delete('/chat/session/clear', { data: { sessionId } });
}

// 5. 获取聊天记录（管理员可用）
export function getSessionChat({ uid, sessionId }) {
  return instance.get(`/chat/session/${uid}/${sessionId}`);
}

// 6. 获取用户会话列表（管理员可用）
export function getUserSessions(uid) {
  return instance.get(`/chat/sessions/${uid}`);
}

// 7. 删除特定会话
export function deleteSession(sessionId) {
  return instance.delete(`/chat/session/${sessionId}`);
}

// 8. 重命名会话
export function renameSession({ sessionId, name }) {
  return instance.put(`/chat/sessions/${sessionId}/rename`, { name });
}
