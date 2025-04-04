<script setup>
import { ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { NInput, NSelect } from 'naive-ui'; // 添加 NSelect 导入
import { useAuthStore } from '../../../stores/authStore';

const username = ref('');
const password = ref('');
const confirmPassword = ref('');
const role = ref(''); // 新增角色字段
const serialNumber = ref(''); // 新增序列号字段
const router = useRouter();
const authStore = useAuthStore();

const options = [
    { label: '客服', value: 'customer' },
    { label: '管理员', value: 'admin' }
]; // 定义角色选择选项

function handleRegister() {
    if (!username.value || !password.value || !confirmPassword.value || !role.value || !serialNumber.value) {
        alert('所有字段都必须填写');
        return;
    }
    
    if (password.value !== confirmPassword.value) {
        alert('两次输入的密码不一致');
        return;
    }
    
    // 这里调用注册API，并传递角色和序列号
    authStore.registerSA(username.value, password.value, role.value, serialNumber.value);
    localStorage.setItem('isAuthenticated', 'true');
    router.push('/home');
}
</script>

<template>
    <div class="flex flex-col items-center w-full h-full">
        <div class="bg-white p-8 rounded-lg shadow-lg w-96 mt-[20vh]">
            <h2 class="text-2xl font-bold mb-6 text-center">注册</h2>
            <form @submit.prevent="handleRegister" class="space-y-4">
                <div>
                    <label for="username" class="block text-sm font-medium text-gray-700">用户名</label>
                    <n-input v-model:value="username" type="text" placeholder="用户名" />
                </div>
                <div>
                    <label for="role" class="block text-sm font-medium text-gray-700">角色选择</label>
                    <n-select v-model:value="role" :options="options" placeholder="请选择角色" />
                </div>
                <div>
                    <label for="serialNumber" class="block text-sm font-medium text-gray-700">序列号</label>
                    <n-input v-model:value="serialNumber" type="text" placeholder="请输入序列号" />
                </div>
                <div>
                    <label for="password" class="block text-sm font-medium text-gray-700">密码</label>
                    <n-input v-model:value="password" type="password" placeholder="密码" />
                </div>
                <div>
                    <label for="confirmPassword" class="block text-sm font-medium text-gray-700">确认密码</label>
                    <n-input v-model:value="confirmPassword" type="password" placeholder="再次输入密码" />
                </div>
                <br/>
                <button
                    type="submit"
                    class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    注册
                </button>

                <div>
                    <router-link to="/login/SA" class="text-blue-600 hover:underline">已有账号？去登录</router-link>
                </div>
                
                <div>
                    <router-link to="/register" class="text-blue-600 hover:underline">用户注册入口</router-link>
                </div>
            </form>
        </div>
    </div>
</template>

<style scoped></style>
