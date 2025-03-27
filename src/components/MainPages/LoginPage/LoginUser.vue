<script setup>
import { ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { NInput } from 'naive-ui';

const username = ref('');
const password = ref('');
const router = useRouter();

function handleLogin() {
    // 检查用户名和密码是否都有内容
    if (username.value && password.value) {
        // 在这里处理登录逻辑
        console.log('用户名:', username.value);
        console.log('密码:', password.value);

        // 导航到 /home
        router.push('/home');
    } else {
        // 显示错误信息或阻止导航
        alert('用户名和密码都必须填写');
    }
}
</script>

<template>
    <div class="login-user flex flex-col items-center h-screen">
        <div class="bg-white p-8 rounded-lg shadow-lg w-96 mt-[20vh]">
            <h2 class="text-2xl font-bold mb-6 text-center">登录</h2>
            <form @submit.prevent="handleLogin" class="space-y-4">
                <div>
                    <label for="username" class="block text-sm font-medium text-gray-700">用户名</label>
                    <n-input v-model:value="username" type="text" placeholder="用户名" />
                </div>
                <div>
                    <label for="password" class="block text-sm font-medium text-gray-700">密码</label>
                    <n-input v-model:value="password" type="text" placeholder="密码" />
                </div>
                <br/>
                <button
                    type="submit"
                    class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    登录
                </button>
            </form>
        </div>
    </div>
</template>

<style scoped></style>
