<template>
    <div class="pt-16">
        <h1 class="mb-6 text-3xl font-bold text-center text-gray-800">{{ title }}</h1>
        <div>
            <div class="max-w-sm mx-auto overflow-hidden text-left shadow sm:rounded-md" v-if="!trip.is_completed">
                <div class="px-4 py-5 bg-white sm:p-6">
                    <div>
                        <GMapMap ref="gMap" :center="location.destination.geometry" :zoom="7"
                            style="width:100%; height: 256px;">
                            <GMapMarker :position="location.current.geometry" :icon="currentIcon" />
                            <GMapMarker :position="location.destination.geometry" :icon="destinationIcon" />
                        </GMapMap>
                    </div>
                    <div class="mt-2">
                        <p class="text-xl">Going to <strong>pick up a passenger</strong></p>
                    </div>
                </div>
                <div class="px-4 py-3 text-right bg-gray-50 sm:px-6">
                    <button v-if="trip.is_started" @click="handleCompleteTrip"
                        class="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-black border border-transparent rounded-md shadow-sm hover:bg-gray-600 focus:outline-none">
                        Complete Trip</button>
                    <button v-else @click="handlePassengerPickedUp"
                        class="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-black border border-transparent rounded-md shadow-sm hover:bg-gray-600 focus:outline-none">
                        Passenger Picked Up</button>
                </div>
            </div>
            <div class="max-w-sm mx-auto overflow-hidden text-left shadow sm:rounded-md" v-else>
                <div class="px-4 py-5 bg-white sm:p-6">
                    <!-- <Tada /> -->
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { useLocationStore } from '@/stores/location.js'
import { useTripStore } from '@/stores/trip.js'
import { useRouter } from 'vue-router'
import { ref, onMounted, onUnmounted } from 'vue'
import http from '@/helpers/http'

let gMap = ref(null)
const location = useLocationStore()
const trip = useTripStore()
const router = useRouter()

const intervalRef = ref(null)

const title = ref('Driving to passenger...')

const currentIcon = {
    url: 'https://openmoji.org/data/color/svg/1F698.svg',
    scaledSize: {
        width: 32,
        height: 32
    }
}

const destinationIcon = {
    url: 'https://openmoji.org/data/color/svg/1F920.svg',
    scaledSize: {
        width: 24,
        height: 24
    }
}

// const updateMapBounds = (mapObject) => {

// }

const broadcastDriverLocation = () => {
    location.updateCurrentLocation()
    http().post(`/api/trip/${trip.id}/location`, {
        driver_loction: {
            lat: location.current.geometry.lat,
            lng: location.current.geometry.lng
        }
    })
        .then((response) => {
            console.log(response)
        })
        .catch((error) => {
            console.error(error)
        })
}

const handlePassengerPickedUp = () => {
    http().post(`/api/trip/${trip.id}/start`)
        .then((response) => {
            title.value = 'Travelling to destination...'
            location.$patch({
                destination: {
                    name: response.data.destination_name,
                    geometry: response.data.destination
                }
            })
            console.log(response.data)
            trip.$patch(response.data)
        })
        .catch((error) => {
            console.error(error)
        })
}

const handleCompleteTrip = () => {
    http().post(`/api/trip/${trip.id}/end`)
        .then((response) => {
            trip.$patch(response.data)
            title.value = 'Trip completed!'

            setTimeout(() => {
                trip.reset()
                location.reset()

                router.push({
                    name: 'landing'
                })
            }, 5000)
        })
        .catch((error) => {
            console.error(error)
        })
}

onMounted(() => {
    location.updateCurrentLocation()

    gMap.value.$mapPromise.then((mapObject) => {
        // updateMapBounds(mapObject)

        intervalRef.value = setInterval(async () => {
            // update the driver's current position and update map bounds
            await location.updateCurrentLocation()
            // update the driver's position in the database
            var originPoint = new google.maps.LatLng(location.current.geometry)
            var destinationPoint = new google.maps.LatLng(location.destination.geometry)
            var latLngBounds = new google.maps.LatLngBounds()

            latLngBounds.extend(originPoint)
            latLngBounds.extend(destinationPoint)

            mapObject.fitBounds(latLngBounds)
            broadcastDriverLocation()
        }, 20000)
    })
})

onUnmounted(() => {
    clearInterval(intervalRef.value)

    intervalRef.value = null
})
</script>