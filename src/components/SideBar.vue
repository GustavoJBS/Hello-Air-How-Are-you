<script setup lang="ts">

defineProps<{
    sideBarData: {
        open: boolean
        lat: number
        lng: number
        name: string
        aqi: number
    }
}>()

</script>

<template>
    <Transition name="slide-fade">
        <div
            v-show="sideBarData?.open"
            class="fixed top-0 right-0 m-5 rounded-md p-3 w-64 h-36 bg-white z-[99999]"
        >
            <div>
                {{ sideBarData.name }}

                <button @click="sideBarData.open = false">
                    Close
                </button>
            </div>
        </div>
    </Transition>
</template>