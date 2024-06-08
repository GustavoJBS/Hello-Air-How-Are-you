<script setup lang="ts">
import { getRangeColor, rangeColors } from '@/constants/helpers';
import type { SideBarData } from '@/views/Home.vue';


defineProps<{
    sideBarData: SideBarData
}>()

function getImage(stationLogo: string) {
    return `https://aqicn.org/air/images/feeds/${stationLogo}`
}
</script>

<template>
    <Transition name="slide-fade">
        <div
            v-show="sideBarData?.open"
            class="absolute max-h-[-webkit-fill-available] overflow-y-auto top-0 right-0 m-5 z-[99999]"
        >
            <v-card
                class="flex flex-col justify-center gap-2 w-80 !p-1 max-h-screen"
            >
                <div class="flex w-full justify-end mt-2 px-2">
                    <v-btn
                        @click="sideBarData.open = false;sideBarData.uid = null"
                        variant="flat"
                        icon="mdi-close"
                        size="small"
                        density="compact"
                    />
                </div>
            
                <v-card-title>
                    <img
                        v-if="sideBarData?.stationLogo"
                        :src="getImage(sideBarData.stationLogo)"
                        class="h-14 max-w-44 mx-auto"
                    >
                </v-card-title>

                <v-card-text>
                    <template v-if="sideBarData.stationUrl">
                        <a
                            class="text-sm font-weight-black underline hover:opacity-60 duration-300"
                            target="_blank"
                            :href="sideBarData.stationUrl"
                        >
                            {{ sideBarData.stationName }} (#{{ String(sideBarData.uid).replace(/\D/g, "") }})
                        </a>
                    </template>

                    <template v-if="!sideBarData.stationUrl">
                        <h2 class="text-sm font-weight-black">
                            {{ sideBarData.stationName }} (#{{ String(sideBarData.uid).replace(/\D/g, "") }})
                        </h2>
                    </template>

                    <h3 class="text-xs font-weight-black italic">
                        {{ sideBarData.cityName }}
                    </h3>
                </v-card-text>
                

                <v-card-text class="flex justify-center flex-col gap-2">
                    <h3 :class="`text-lg font-semibold m-auto text-${getRangeColor(sideBarData.aqi)?.color}`">
                        {{ sideBarData.aqi }} ({{ getRangeColor(sideBarData.aqi)?.name }})
                    </h3>

                    <div class="grid grid-cols-7 w-full">
                        <div
                            v-for="{ color, span } in rangeColors"
                            :class="`flex h-2 flex-nowrap bg-${color} col-span-${span} first:rounded-l-md last:rounded-r-md`"
                        />
                    </div>

                    <div class="flex flex-col gap-1">
                        <div v-for="{ color, name, description } in rangeColors">
                            <div class="flex gap-1 items-center">
                                <div :class="`w-3 h-3 bg-${color} rounded-full`" />
                                <span>{{ name }}</span>
                            </div>
                            <span class="text-xs">
                                {{ description }}
                            </span>
                        </div>
                    </div>
                </v-card-text>
            </v-card>
        </div>
    </Transition>
</template>