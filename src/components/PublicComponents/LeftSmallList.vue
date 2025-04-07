<script setup>
import { ref } from 'vue'
import { QuickreplyFilled } from '@vicons/material'
import { FileImport } from '@vicons/fa'
import { PeopleRound } from '@vicons/material'
import { Help } from '@vicons/ionicons5'
import { Icon } from '@vicons/utils' 
</script>

<template>
    <LeftSM class="bg-gray-500 w-15 p-4">
        <ul class="flex flex-col gap-4 justify-center items-center">
            <li><router-link to="/quickCreate"><Icon size="36" color="#87CEFA"><QuickreplyFilled></QuickreplyFilled></Icon></router-link></li>
            <li><router-link to="/sourceGoDown"><Icon size="36" color="#87CEFA"><FileImport></FileImport></Icon></router-link></li>
            <li><router-link to="/chatWithPeople"><Icon size="36" color="#87CEFA"><PeopleRound></PeopleRound></Icon></router-link></li>
            <li><router-link to="/helpWord"><Icon size="36" color="#87CEFA"><Help></Help></Icon></router-link></li>
        </ul>
    </LeftSM>
</template>
