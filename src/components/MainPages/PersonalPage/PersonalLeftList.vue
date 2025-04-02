<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
    <aside class="bg-gray-100 w-80">
        <div class="p-4">
            <h3 class="title font-semibold mb-2">个人</h3>
            <RouterLink 
                to="/personal/Info" 
                class="block px-4 py-2 hover:bg-gray-200 rounded transition-colors list-section"
                active-class="bg-gray-200"
            >
                个人资料
            </RouterLink>
            <RouterLink 
                to="/personal/Statistic" 
                class="block px-4 py-2 hover:bg-gray-200 rounded transition-colors list-section"
                active-class="bg-gray-200"
            >
                使用统计
            </RouterLink>
        </div>
    </aside>
</template>

<style scoped>
.title {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 1rem;
}
.list-section {
    margin-bottom: 1.2rem;
}
</style>
