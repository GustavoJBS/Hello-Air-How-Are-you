<script setup lang="ts">
import { reactive } from 'vue';
    const filter = reactive({
        search: ''
    })
</script>

<template>
    <div
        class="relative flex gap-2 items-center flex-col md:flex-row justify-between w-screen bg-white border-gray-500 border-b-2 p-4"
    >
        <div class="flex items-center gap-2">
            <img
                src="/img/cloud.png"
                class="w-12 h-12"
            >
    
            <h1 class="text-2xl font-patua font-semibold italic">
                Hello Air how are you?
            </h1>
        </div>

        <div class="flex w-full md:w-auto">
            <div class="flex justify-center items-start m-auto gap-2">
                <v-text-field
                    label="Search for a city"
                    min-width="300"
                    max-width="300"
                    class="m-auto"
                    :rules="[(v) => !!v || 'Field is required']"
                    v-model="filter.search"
                ></v-text-field>
    
                <v-btn
                    icon="mdi-magnify"
                    @click="$emit('searchCity', String(filter.search))"
                />
            </div>
        </div>
    </div>
</template>