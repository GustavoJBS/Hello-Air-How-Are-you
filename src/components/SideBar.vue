<script setup lang="ts">

defineProps<{
    sideBarData: {
        uid: null|number,
        open: boolean,
        lat: number,
        lng: number,
        stationName: string,
        cityName: string,
        stationLogo: string,
        stationUrl: null|string,
        aqi: number
    }
}>()

const rangeColors = [
    {
        min: 0,
        max: 40,
        span: 1,
        color: 'green-500',
        name: 'Good',
        description: "Air quality is considered satisfactory, and air pollution poses little or no risk"
    },
    {
        min: 41,
        max: 80,
        span: 1,
        color: 'yellow-400',
        name: 'Moderate',
        description: "Air quality is acceptable; however, for some pollutants there may be a moderate health concerns."
    }, 
    {
        min: 81,
        max: 120,
        span: 1,
        color: 'orange-300',
        name: 'Bad',
        description: "Members of sensitive groups may experience health effects. The general public is not likely to be affected."
    },
    {
        min: 121,
        max: 200,
        span: 2,
        color: 'red-500',
        name: 'Very bad',
        description: "Everyone may begin to experience health effects; members of sensitive groups may experience more serious health effects."
    },
    {
        min: 201,
        max: '208+',
        span: 2,
        color: 'violet-600',
        name: 'Terrible',
        description: "Health alert: everyone may experience more serious health effects"
    }
]

function getImage(stationLogo: string) {
    return `https://aqicn.org/air/images/feeds/${stationLogo}`
}

function getRangeColor(aqi: number) {
    if (aqi === 0) {
        return {
            color: 'black',
            name: 'No Data'
        };
    }

    return rangeColors.find(({ min, max }) => {
        return typeof max === 'string'
            ? aqi >= min
            : aqi >= min && aqi <= max
    })
}
</script>

<template>
    <Transition name="slide-fade">
        <div
            v-show="sideBarData?.open"
            class="fixed top-0 right-0 m-5 z-[99999]"
        >
            <v-card
                class="flex flex-col justify-center gap-2 w-80 !p-1 max-h-screen"
            >
                <div class="flex w-full justify-end">
                    <v-btn
                        @click="sideBarData.open = false;sideBarData.uid = null"
                        variant="flat"
                        icon="mdi-close"
                        size="small"
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
                            {{ sideBarData.stationName }} (#{{ sideBarData.uid }})
                        </a>
                    </template>

                    <template v-if="!sideBarData.stationUrl">
                        <h2 class="text-sm font-weight-black">
                            {{ sideBarData.stationName }} (#{{ sideBarData.uid }})
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