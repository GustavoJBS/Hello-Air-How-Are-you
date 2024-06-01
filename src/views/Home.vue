<template>
    <div>    
        <SideBar :sideBarData="sideBarData" />
    
        <div id="mapContainer" class="w-screen h-screen"></div>
    </div>
</template>

<script setup>

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { onMounted, reactive } from "vue";
import axios from "axios";

import SideBar from "../components/SideBar.vue";

let searchLatLng = [];

const sideBarData = reactive({
    open: false,
    lat: null,
    lng: null, 
    name: null,
    aqi: null
});

const baseUrl = 'https://api.waqi.info'

let map;

onMounted(() => {
    navigator.geolocation.getCurrentPosition(function (position) {
        addMap(position.coords.latitude, position.coords.longitude);
    }, function () {
        alert('Failed to Find your location.');
        addMap(0, 0);
    })
})

function addMap(latitude, longitude) {
    map = L.map("mapContainer").setView([latitude, longitude], 8);
    L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    setMarkers()
}

function setMarkers() {
    const coordinates = map.getBounds();

    const southWest = coordinates.getSouthWest();

    const northEast = coordinates.getNorthEast();

    findStations(
        southWest.lat,
        southWest.lng,
        northEast.lat,
        northEast.lng
    )
}

function findStations(lat1, lng1, lat2, lng2) {
    axios.get(`${baseUrl}/map/bounds`, {
        params: {
            token: 'f1f0dd17dce3aedf4604850d8caa3bfb25e81d1a',
            latlng: `${lat1},${lng1},${lat2},${lng2}`,
            networks: 'all'
        }
    }).then(function (response) {
        const data = response?.data?.data
        searchLatLng = [lat1, lng1, lat2, lng2];

        if (data) {
            data.forEach(coordinate => {
                L.marker([coordinate.lat, coordinate.lon])
                    .addTo(map)
                    .on('click', () => {
                        sideBarData.open = true
                        sideBarData.lat = coordinate.lat
                        sideBarData.lng = coordinate.lon
                        sideBarData.name = coordinate.station.name
                        sideBarData.aqi = coordinate.aqi

                        map.panTo(new L.LatLng(coordinate.lat, coordinate.lon));
                    });
            });
        }
    })
}

</script>