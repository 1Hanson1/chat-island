// src/api/user.js
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

//category:NORMAL, VIP, ADMIN,CS

/**
 * 用户注册
 * @param {
 * name: string,
 * password: string,
 * category: string,
 * } data 
 * @returns {
 * uid: string,
 * name: string,
 * category: string,
 * password: string,
 * createTime: string,
 * }
 */
export function register(data) {
  return instance.post('/user/register', {
      name: data.name,
      password: data.password,
      category: data.category,
  });
}

/**
 * 用户登录
 * @param {
 * name: string,
 * password: string,
 * } data 
 * @returns {
 * token: string,
 * }
 */
export function login(data) {
  return instance.post('/user/login', {
      name: data.name,
      password: data.password
    })
}

/**
 * 获取用户信息
 * @param {
 * name: string,
 * } data 
 * @returns {
 * userinfo:{
 * uid: string,
 * name: string,
 * category: string,
 * creteTime: string,
 * vipStartTime: string,
 * vipEndTime: string,
 * isVipActive: boolean,
 * dailtlimit: number,
 * usedToday: number,
 * remainingUsage: number,
 * }
 * }
 */
export function getUserInfo(data) {
  return instance.get('/user/info', {
    params: { name: data.name }
  });
}

/**
 * 更新用户信息
 * @param {
 * uid: string,
 * name: string,
 * password: string,
 * category: string,
 * } data 
 * @returns {
 * message: string,
 * }
 */
export function updateUser(data) {
  return instance.put('/user/update', {
    uid: data.uid,
    name: data.name,
    password: data.password,
    category: data.category,
  });
}

/**
 * 删除用户
 * @param {
 * name: string,
 * } data 
 * @returns {
 * message: string,
 * }
 */
export function deleteUser(data) {
  return instance.delete('/user/delete', { params: { name: data.name } });
}

/**
 * 升级为VIP
 * name: string,
 * @param {
 * vipKey: string,
 * } data 
 * @returns {
 * success: boolean,
 * meesage: string,
 * category: string,
 * dailyLimit: number,
 * vipStartTime: string,
 * vipEndTime: string,
 * }
 */
export function upgradeVip(data) {
  console.log(data.name);
  return instance.post('/user-quota/upgrade-vip',
    {
      vipKey: data.vipKey,
    },
    {
      params: {
        name: data.name,
      },
    }
  );
}


/**
 * VIP续费
 * name: string,
 * @param {
 * vipKey: string,
 * } data 
 * @returns {
 * success: boolean,
 * message: string,
 * message: string,
 * newVipEndTime: string,
 * }
 */
export function renewVip(data) {
  return instance.post('/user-quota/renew-vip', 
    {
      vipKey: data.vipKey,
    },
    {
      params: {
        name: data.name,
      },
    }
  );
}
/**
 * 管理员强制降级用户VIP
 * @param {
 * toRemover: string,
 * reason: string,
 * } payload 
 * @returns {
 * success: boolean,
 * message: string,
 * }
 */
export function removeVip(payload) {
  return instance.post('/user-quota/admin/vip-remove', {
    toRemover: payload.toRemover,
    reason: payload.reason,
  });
}
