import axios from 'axios';

const baseURL = 'http://47.117.107.164:8113/api';
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
