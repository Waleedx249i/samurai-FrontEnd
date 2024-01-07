<template>
    <div class="pt-16">
        <h1 class="mb-6 text-xl font-bold text-center text-gray-600">Here's your trip</h1>
        <div>
            <div class="max-w-sm mx-auto overflow-hidden text-left shadow-2xl shadow-gray-950 sm:rounded-md">
                <div class="px-3 py-3 bg-white shadow-lg sm:p-6">
                    <div>
                        <GMapMap ref="gMap" :center="location.destination.geometry" :zoom="7"
                            style="width: 100%; height: 270px;">
                        </GMapMap>
                    </div>

                </div>
                <div class="flex justify-between px-4 py-3 mb-6 bg-gray-50 sm:px-6">
                    <div class="inline-flex ">
                        <p class="text-xl">Going to <strong>{{ location.destination.name }}</strong></p>
                    </div>
                    <button @click="handleConfirmTrip"
                        class="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-black border border-transparent rounded-md shadow-sm hover:bg-gray-600 focus:outline-none">
                        Let's Go!</button>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { useLocationStore } from "@/stores/location.js";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import http from "../helpers/http";
import { useTripStore } from "@/stores/trip.js";
const location = useLocationStore()
const router = useRouter()
location.updateCurrentLocation()

let trip = useTripStore()
let gMap = ref(null)
const handleConfirmTrip = () => {
    http().post('/api/trip', {
        origin: location.current.geometry,
        destination: location.destination.geometry,
        'destination_name': location.destination.name,
    }).then((response) => {
        console.log(response.data)
        trip.$patch(response.data)
        console.log(trip)
        router.push({
            name: 'trip'
        })
    }).catch((error) => {
        console.error(error)
    })
}
onMounted(async () => {
    // does the user have a location set?
    if (location.destination.name === '') {
        router.push({
            name: 'location'
        })
    }

    // lets get the users current location
    await location.updateCurrentLocation()

    // draw a path on the map
    gMap.value.$mapPromise.then((mapObject) => {

        let currentPoint = new google.maps.LatLng(location.current.geometry),
            destinationPoint = new google.maps.LatLng(location.destination.geometry),
            directionsService = new google.maps.DirectionsService,
            directionsDisplay = new google.maps.DirectionsRenderer({
                map: mapObject
            })

        directionsService.route({
            origin: currentPoint,
            destination: destinationPoint,
            avoidTolls: false,
            avoidHighways: false,
            travelMode: google.maps.TravelMode.DRIVING
        }, (res, status) => {
            if (status === google.maps.DirectionsStatus.OK) {
                directionsDisplay.setDirections(res)
            } else {
                console.error(status)
            }
        })
    })
})
</script>