import axios from 'axios';

const baseURL = 'http://47.117.136.45:8113/api';
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
 * 客户服务API
 * 部分接口需要在请求头中携带Authorization字段，格式为Bearer <token>
 */

// 1. 用户提问接口
export function submitHelpMessage({ uid, msg }) {
  return instance.post('/help/chat', { uid, msg });
}

// 2. 用户查询历史
export function getUserInquiries(uid) {
  return instance.get('/help/inquiries', { params: { uid } });
}

// 3. 客服获取待处理消息
export function getCustomerInquiries(uid) {
  return instance.get('/help/inquiries4cs', { params: { uid } });
}

// 4. 客服完成回复
export function completeInquiry({ csUid, inquiryId, replyMsg }) {
  return instance.post('/help/complete', { inquiryId, replyMsg }, { params: { csUid } });
}
