<template>
    <div class="flex flex-col relative w-screen h-screen">
        <TopBar @searchCity="searchCity" />

        <div class="h-full w-full relative">
            <SideBar :sideBarData="sideBarData" />
    
            <template v-if="JSON.stringify(latlng.searchLatLng) !== JSON.stringify(latlng.currentLatLng)">
                <div class="absolute flex justify-center w-screen top-0 mt-3 z-[9999] m-auto">
                    <SearchAreaButton @click="findStations()" />
                </div>
            </template>
        
            <div id="mapContainer" class="w-full h-full"></div>
        </div>
    </div>
</template>

<script setup lang="ts">

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { onMounted, reactive } from "vue";
import axios from "axios";

import TopBar from "../components/TopBar.vue";
import SideBar from "../components/SideBar.vue";

import SearchAreaButton from "../components/SearchAreaButton.vue";
import { getRangeColor } from "@/constants/helpers";

export interface SideBarData {
    uid: null|number,
    open: boolean,
    lat: number,
    lng: number,
    stationName: string,
    cityName: string,
    aqi: number,
    stationLogo: string,
    stationUrl: string
}

interface Coordinate {
    lat: number,
    lng: number
}

interface LatLng {
    searchLatLng: number[],
    currentLatLng: number[]
}

const sideBarData: SideBarData = reactive({
    uid: 0,
    open: false,
    lat: 0,
    lng: 0,
    stationName: '',
    stationLogo: '',
    stationUrl: '',
    cityName: '',
    aqi: 0
});

const latlng: LatLng = reactive({
    searchLatLng: [],
    currentLatLng: []
})

const baseUrl = 'https://api.waqi.info'

let map: L.Map;

onMounted(() => {
    navigator.geolocation.getCurrentPosition(function (position) {
        addMap(position.coords.latitude, position.coords.longitude);
    }, function () {
        addMap(46, 2);
    })
})

function addMap(latitude: number, longitude: number) {
    map = L.map("mapContainer", {
        minZoom: 5
    }).setView([latitude, longitude], 5).on("moveend", function () {
        const {lat1, lat2, lng1, lng2} = getMapBounds()

        latlng.currentLatLng = [lat1, lng1, lat2, lng2];
    });

    L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map)

    findStations() 
}


function findStations() {
    const {lat1, lat2, lng1, lng2} = getMapBounds()

    axios.get(`${baseUrl}/map/bounds`, {
        params: {
            token: import.meta.env.VITE_API_KEY,
            latlng: `${lat1},${lng1},${lat2},${lng2}`,
            networks: 'all'
        }
    }).then(function (response) {
        const data = response?.data?.data
        latlng.searchLatLng = [lat1, lng1, lat2, lng2];
        latlng.currentLatLng = [lat1, lng1, lat2, lng2];

       
        if (Array.isArray(data)) {
            clearMarkers()

            data.forEach(coordinate => {
                L.marker([coordinate.lat, coordinate.lon], {
                    icon: L.divIcon({
                        className: 'bg-transparent',
                        html: `
                            <div
                                class='marker-pin bg-${getRangeColor(Number(coordinate.aqi))?.color}'
                            ></div>
                            <span
                                class="absolute w-full text-base my-2.5 text-center font-bold text-${getRangeColor(Number(coordinate.aqi))?.color}"
                            >
                                ${isNaN(coordinate.aqi) ? 0 : coordinate.aqi}
                            </span>`,
                        iconSize: [30, 42],
                        iconAnchor: [15, 42]
                    })
                })
                    .addTo(map)
                    .on('click', () => {
                        if (sideBarData.uid === coordinate.uid) {
                            return;
                        }

                        axios.get(`${baseUrl}/feed/@${coordinate.uid}`, {
                            params: {
                                token: import.meta.env.VITE_API_KEY
                            }
                        }).then((station) => {
                            const stationData = station?.data?.data;

                            if (stationData) {
                                sideBarData.uid = coordinate.uid
                                sideBarData.open = true
                                sideBarData.lat = coordinate.lat
                                sideBarData.lng = coordinate.lon
                                sideBarData.stationName = stationData.attributions[0].name
                                sideBarData.stationLogo = stationData.attributions[0].logo
                                sideBarData.stationUrl = stationData.attributions[0]?.url
                                sideBarData.cityName = stationData.city.location 
                                    ? stationData.city.location
                                    : stationData.city.name
                                sideBarData.aqi = isNaN(stationData.aqi) ? 0 : stationData.aqi

                                map.panTo(new L.LatLng(coordinate.lat, coordinate.lon));
                            }
                        }).catch(() => {
                            sideBarData.open = false
                        })
                    });
            });
        }
    })
}

function clearMarkers() {
    map.eachLayer((layer: any) => {
        if (layer instanceof L.Marker) {
            layer.remove();
        }
    });
}

function getMapBounds() {
    const coordinates = map.getBounds();

    const {lat: lat1, lng: lng1}: Coordinate = coordinates.getSouthWest();

    const {lat: lat2, lng: lng2}: Coordinate = coordinates.getNorthEast();

    return {
        lat1,
        lng1,
        lat2,
        lng2 
    }
}

function searchCity(search: string = '') {
    axios.get(`${baseUrl}/search/`, {
        params: {
            token: import.meta.env.VITE_API_KEY,
            keyword: search,
        }
    }).then(({data}) => {
        if (data?.data && data.data.length > 0) {
            const coordinates = data?.data?.[0]?.city?.geo ?? data?.data?.[0]?.station?.geo;

            map.setView(coordinates, 10);

            findStations()
        } else {
            alert('City not found')
        }
    })
}
</script>