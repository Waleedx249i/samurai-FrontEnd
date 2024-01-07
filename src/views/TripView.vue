<template>
    <div class="pt-16">
        <h1 class="mb-6 text-3xl font-bold text-center text-gray-800">{{ title }}</h1>
        <div>
            <div class="max-w-sm mx-auto overflow-hidden text-left shadow sm:rounded-md">
                <div class="px-4 py-5 bg-white sm:p-6">
                    <div>
                        <GMapMap :zoom="14" :center="location.current.geometry" ref="gMap"
                            style="width:100%; height: 256px;">
                            <GMapMarker :position="location.current.geometry" :icon="currentIcon" />
                            <GMapMarker :position="trip.driver_location" :icon="driverIcon" />
                        </GMapMap>
                    </div>
                </div>
                <div class="px-4 py-3 text-right bg-gray-50 sm:px-6">
                    <span>{{ message }}</span>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { useLocationStore } from '@/stores/location'
import { useTripStore } from '@/stores/trip'
import { useRouter } from 'vue-router'
import { onMounted, ref } from 'vue'

import Pusher from 'pusher-js'

const location = useLocationStore()
let trip = useTripStore()
const router = useRouter()
location.updateCurrentLocation()


const title = ref('Waiting on a driver...')
const message = ref('When a driver accepts the trip, their info will appear here.')

const gMap = ref(null)
const gMapObject = ref(null)

const currentIcon = {
    url: 'https://openmoji.org/data/color/svg/1F910.svg',
    scaledSize: {
        width: 24,
        height: 24
    }
}

const driverIcon = {
    url: 'https://openmoji.org/data/color/svg/1F698.svg',
    scaledSize: {
        width: 32,
        height: 32
    }
}

const updateMapBounds = () => {
    let originPoint = new google.maps.LatLng(location.current.geometry)
    let driverPoint = new google.maps.LatLng(trip.driver_location)
    let latLngBounds = new google.maps.LatLngBounds()

    latLngBounds.extend(originPoint)
    latLngBounds.extend(driverPoint)

    gMapObject.value.fitBounds(latLngBounds)
}

onMounted(() => {
    trip = useTripStore()
    gMap.value.$mapPromise.then((mapObject) => {
        gMapObject.value = mapObject
    })

    let pusher = new Pusher("589c07b72e3f4bae8b19", {
        cluster: "mt1",
    });

    let passenger = 'passinger_' + String(trip.user_id)
    let channel = pusher.subscribe(passenger);
    channel.bind('trip.accepted', (e) => {
        trip.$patch(e.trip)

        title.value = "A driver is on the way!"
        message.value = `${e.trip.driver.user.name} is coming in a ${e.trip.driver.year} ${e.trip.driver.color} ${e.trip.driver.make} ${e.trip.driver.model} with a license plate #${e.trip.driver.license_plate}`
    })
    channel.bind('trip.location.updated', (e) => {
        trip.$patch(e.trip)

        setTimeout(updateMapBounds, 10000)
    })
    channel.bind('trip.started', (e) => {
        trip.$patch(e.trip)
        location.$patch({
            current: {
                geometry: e.trip.destination
            }
        })

        title.value = "You're on your way!"
        message.value = `You are headed to ${e.trip.destination_name}`
    })
    channel.bind('trip.ended', (e) => {
        trip.$patch(e.trip)

        title.value = "You've arrived!"
        message.value = `Hope you enjoyed your ride with ${e.trip.driver.user.name}`

        setTimeout(() => {
            trip.reset()
            location.reset()

            router.push({
                name: 'landing'
            })
        }, 10000)
    })
})
</script>