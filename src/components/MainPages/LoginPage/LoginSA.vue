<script setup>
import { ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { NInput, NSelect} from 'naive-ui';
import { useAuthStore } from '../../../stores/authStore';

const username = ref('');
const password = ref('');
const router = useRouter();
const authStore = useAuthStore();
const role = ref('');

const options = [
    { label: '客服', value: 'service' },
    { label: '管理员', value: 'admin' }
]; // 定义角色选择选项

function handleLogin() {
    if (username.value && password.value) {
        authStore.loginSA(username.value, password.value, role.value);
        localStorage.setItem('isAuthenticated', 'true');
        console.log(role.value);
        if (role.value === 'admin') {
            router.push('/manager');
        } else if (role.value === 'service') {
            router.push('/service');
        } else {
            console.log('未知角色');
        }
    } else {
        alert('用户名和密码都必须填写');
    }
}
</script>

<template>
    <div class="flex flex-col items-center w-full h-full">
        <div class="bg-white p-8 rounded-lg shadow-lg w-96 mt-[20vh]">
            <h2 class="text-2xl font-bold mb-6 text-center">登录</h2>
            <form @submit.prevent="handleLogin" class="space-y-4">
                <div>
                    <label for="username" class="block text-sm font-medium text-gray-700">用户名</label>
                    <n-input v-model:value="username" type="text" placeholder="用户名" />
                </div>
                <div>
                    <label for="role" class="block text-sm font-medium text-gray-700">角色选择</label>
                    <n-select v-model:value="role" :options="options" placeholder="请选择角色" />
                </div>
                <div>
                    <label for="password" class="block text-sm font-medium text-gray-700">密码</label>
                    <n-input v-model:value="password" type="password" placeholder="密码" />
                </div>
                <br/>
                <button
                    type="submit"
                    class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    登录
                </button>

                <div>
                    <router-link to="/register/SA" class="text-blue-600 hover:underline">客服/管理员注册</router-link>
                </div>
                
                <div>
                    <router-link to="/login" class="text-blue-600 hover:underline">用户登录入口</router-link>
                </div>
            </form>
            
        </div>
    </div>
</template>

<style scoped></style>
