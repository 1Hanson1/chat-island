<script setup>
import { ref } from 'vue'

const items = ref([
    {
        name: 'Home',
        imgage: 'home',
        link: '/'
    },
    {
        name: 'Discover',
        image: 'compass',
        link: '/discover'
    },
    {
        name: 'Profile',
        image: 'user',
        link: '/profile'
    },
    {
        name: 'Messages',
        image: 'envelope',
        link: '/messages'
    },
])
</script>

<template>
    <LeftSM class="bg-gray-500 w-15 p-4">
        <ul>
            <li v-for="(item, index) in items" :key="index" class="flex items-center mb-2">
                <a :href="item.link">
                    <img :src="'./assets/pics/icons/' + item.image + '.svg'" :alt="item.name" class="w-7.5 h-7.5 mr-2">
                </a>
            </li>
        </ul>
    </LeftSM>
</template>
