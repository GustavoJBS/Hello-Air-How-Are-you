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

const baseUrl = 'https://api.waqi.info'

let map;

onMounted(() => {
    navigator.geolocation.getCurrentPosition(function (position) {
        addMap(position.coords.latitude, position.coords.longitude);
        // addMap(46.32347302852984, 2.396251296360319);
    }, function () {
        addMap(0, 0);
    })
})

function addMap(latitude, longitude) {
    map = L.map("mapContainer", {
        minZoom: 6
    }).setView([latitude, longitude], 6)
        .on("moveend", function () {
            findStations()
        });

    L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map)

    findStations()
}


function findStations() {
    const coordinates = map.getBounds();

    const {lat: lat1, lng: lng1} = coordinates.getSouthWest();

    const {lat: lat2, lng: lng2} = coordinates.getNorthEast();

    axios.get(`${baseUrl}/map/bounds`, {
        params: {
            token: import.meta.env.VITE_API_KEY,
            latlng: `${lat1},${lng1},${lat2},${lng2}`,
        }
    }).then(function (response) {
        const data = response?.data?.data
        searchLatLng = [lat1, lng1, lat2, lng2];

       
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
</script>