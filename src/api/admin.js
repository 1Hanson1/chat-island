// adminApi.js
import axios from 'axios';

const baseURL = 'http://47.117.136.45:8113/';
const instance = axios.create({ baseURL });

// 请求拦截器：自动附加 JWT token
instance.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers['Authorization'] = `Bearer ${token}`;
  return config;
});

//
// ChatAdminController
//

// 获取用户所有聊天会话列表
export function getChatSessions({ uid }) {
  return instance.get(`/admin/chat/sessions/get/${uid}`);
}

// 获取指定用户某个会话的详情及消息记录
export function getChatSessionDetail({ uid, sessionId }) {
  return instance.get('/admin/chat/session/get', {params:{ uid, sessionId }});
}

// 删除某个用户的某个会话
export function deleteChatSession({ uid, sessionId }) {
  return instance.delete('/admin/chat/session/delete', { data: { uid, sessionId } });
}

// 删除某个用户的所有聊天会话
export function deleteAllChatSessions({ uid }) {
  return instance.delete(`/admin/chat/sessions/delete/${uid}`);
}

// 获取某个用户的聊天统计信息
export function getChatStats({ uid }) {
  return instance.get(`/admin/chat/stats/${uid}`);
}

// 删除某个用户的空会话（无消息的）
export function clearEmptyChatSessions({ uid }) {
  return instance.delete(`/admin/chat/sessions/clear/${uid}`);
}

// 重命名某个用户的会话
export function renameChatSession({ uid, sessionId, newName }) {
  return instance.put('/admin/chat/session/rename', { uid, sessionId, newName });
}

//
// CsAdminController
//

// 获取客服用户的待处理查询列表
export function getPendingInquiries({ cid }) {
  return instance.get(`/admin/cs/inquiries/${cid}`);
}

// 完成用户问题并提交客服回复
export function completeInquiry({ csUid, inquiryId, replyMsg }) {
  return instance.post('/admin/cs/complete', { csUid, inquiryId, replyMsg });
}

//
// KnowledgeBaseAdminController
//

// 获取指定用户某知识库的所有文档
export function getUserKbDocs({ uid, kid }) {
  return instance.get('/admin/knowledge/kb-docs', { params: { uid, kid } });
}

// 获取指定用户的所有知识库及文档
export function getUserKbs({ uid }) {
  return instance.get('/admin/knowledge/user-kbs', { params: { uid } });
}

// 批量获取多个用户的知识库信息
export function getBatchUserKbs({ ids }) {
  return instance.get('/admin/knowledge/batch-users', { params: { ids } });
}

// 删除指定用户的所有知识库
export function deleteAllUserKbs({ uid }) {
  return instance.delete('/admin/knowledge/delete-all-user-kbs', { params: { uid } });
}

// 删除指定用户的某个知识库
export function deleteUserKb({ uid, kid }) {
  return instance.delete('/admin/knowledge/delete-user-kb', { params: { uid, kid } });
}

// 清空指定知识库中的所有文档（不删除知识库本身）
export function clearKbDocs({ uid, kid }) {
  return instance.delete('/admin/knowledge/clear-kb-docs', { params: { uid, kid } });
}

// 删除指定用户知识库中的某个文档
export function deleteUserDoc({ uid, docId }) {
  return instance.delete('/admin/knowledge/delete-user-doc', { params: { uid, docId } });
}

// 创建用户的新知识库
export function createUserKb({ uid, name, tags = [], description = "" }) {
  return instance.post('/admin/knowledge/create-user-kb', { uid, name, tags, description });
}

// 向用户知识库中上传新文档
export function uploadUserDoc({ uid, kid, file }) {
  const formData = new FormData();
  formData.append('file', file);
  return instance.post('/admin/knowledge/upload-user-doc', formData, { params: { uid, kid } });
}

//
// UserAdminController
//

// 获取所有用户（支持按类别筛选）
export function getAllUsers({ category }) {
  return instance.get('/admin/user/get-all', { params: { category } });
}

// 通过用户名获取用户详情（含配额和VIP历史）
export function getUserByName({ username }) {
  return instance.get(`/admin/user/get/${username}`);
}

// 通过用户ID获取用户详情
export function getUserById({ uid }) {
  return instance.get('/admin/user/get', { params: { uid } });
}

// 创建新用户（可指定类别）
export function createUser({ name, password, category = "NORMAL" }) {
  return instance.post('/admin/user/add', { name, password, category });
}

// 更新用户信息（支持改名、改密码、变更类别）
export function updateUser({ username, name, password, category, reason }) {
  return instance.put(`/admin/user/update/${username}`, { name, password, category, reason });
}

// 删除指定用户
export function deleteUser({ username }) {
  return instance.delete(`/admin/user/delete/${username}`);
}

// 获取用户模型调用记录（支持分页）
export function getUserInvocations({ username, offset = 0, limit = 50 }) {
  return instance.get(`/admin/user/user/invocations/${username}`, { params: { offset, limit } });
}

// 获取系统统计信息（用户数、VIP活跃数等）
export function getUserStatistics() {
  return instance.get('/admin/user/statistics');
}

// 手动触发VIP状态检查
export function triggerVipCheck() {
  return instance.post('/admin/user/vip-status-check');
}

// 获取用户配额摘要信息（按类别筛选）
export function getQuotaSummary({ category = "NORMAL" }) {
  return instance.get('/admin/user/quota-summary', { params: { category } });
}

// 移除指定用户的VIP状态
export function removeUserVip(payload) {
  return instance.post('/admin/user/remove-vip', {
    username: payload.toRemover,
    reason: payload.reason,
  });
}
