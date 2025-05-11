// src/api/user.js
import axios from 'axios';

const baseURL = 'http://106.15.28.195:8113/api';
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

// 注册
export function register(data) {
  return instance.post('/user/register', data);
}

// 登录
export function login(data) {
  return instance.post(`${baseURL}/user/login`, {
      name: data.name,
      password: data.password
    })
}

// 获取用户信息
export function getUserInfo(name) {
  return instance.get(`${baseURL}/user/info`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          name: name.value
        }
      })
}

// 更新用户
export function updateUser(data) {
  return instance.put('/user/update', data);
}

// 删除用户
export function deleteUser(name) {
  return instance.delete('/user/delete', { params: { name } });
}

// 升级 VIP
export function upgradeVip(name, vipKey) {
  return instance.post('/user-quota/upgrade-vip', { vipKey }, { params: { name } });
}

// VIP 续费
export function renewVip(name, vipKey) {
  return instance.post('/user-quota/renew-vip', { vipKey }, { params: { name } });
}

// 管理员移除 VIP
export function removeVip(payload) {
  return instance.post('/user-quota/admin/vip-remove', payload);
}
