<template>
    <div>    
        <SideBar :sideBarData="sideBarData" />

        <template v-if="JSON.stringify(latlng.searchLatLng) !== JSON.stringify(latlng.currentLatLng)">
            <div class="fixed flex justify-center w-screen top-0 mt-3 z-[9999] m-auto">
                <SearchArea @click="findStations()" />
            </div>
        </template>
    
        <div id="mapContainer" class="w-screen h-screen"></div>
    </div>
</template>

<script setup>

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { onMounted, reactive } from "vue";
import axios from "axios";

import SideBar from "../components/SideBar.vue";

import SearchArea from "../components/SearchArea.vue";

const sideBarData = reactive({
    uid: null,
    open: false,
    lat: null,
    lng: null,
    stationName: null,
    stationLogo: null,
    stationUrl: null,
    cityName: null,
    aqi: null
});

const latlng = reactive({
    searchLatLng: [],
    currentLatLng: []
})

const baseUrl = 'https://api.waqi.info'

let map;

onMounted(() => {
    navigator.geolocation.getCurrentPosition(function (position) {
        addMap(position.coords.latitude, position.coords.longitude);
    }, function () {
        addMap(46, 2);
    })
})

function addMap(latitude, longitude) {
    map = L.map("mapContainer", {
        minZoom: 6
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
                L.marker([coordinate.lat, coordinate.lon])
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
    map.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
            layer.remove();
        }
    });
}

function getMapBounds() {
    const coordinates = map.getBounds();

    const {lat: lat1, lng: lng1} = coordinates.getSouthWest();

    const {lat: lat2, lng: lng2} = coordinates.getNorthEast();

    return {
        lat1,
        lng1,
        lat2,
        lng2 
    }
}
</script>