<template>
    <div class="pt-5 sm:pt-16">

        <form @submit.prevent="handleSelectLocation">
            <div
                class="max-w-sm mx-auto overflow-hidden text-left bg-white rounded-md shadow-2xl mt-11 shadow-gray-500 sm:rounded-md">
                <img class="self-center w-full mx-auto " src="../assets/samurai.png" alt="samurai">

                <div class="px-4 py-5 sm:p-6">
                    <h1 class="mb-4 font-semibold text-center text-l text-zinc-600">Where are we going?</h1>
                    <div>
                        <GMapAutocomplete placeholder="My destination" @place_changed="handleLocationChanged"
                            class="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:border-black focus:outline-none">
                        </GMapAutocomplete>
                    </div>
                </div>
                <div class="px-4 py-3 text-right sm:px-6">
                    <button @click.prevent="handleSelectLocation" type="button"
                        class="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-900 border border-transparent rounded-md shadow-sm hover:bg-indigo-400 focus:outline-none">
                        Find A Ride
                    </button>
                </div>
            </div>
        </form>
    </div>
</template>
<script setup>
import { useLocationStore } from "@/stores/location.js";
import { useRouter } from "vue-router";
const location = useLocationStore()
const router = useRouter()
const handleLocationChanged = (e) => {
    console.log('handleLocationChanged', e)
    location.$patch({
        destination: {
            name: e.name,
            address: e.formated_address,
            geometry: {
                lat: e.geometry.location.lat(),
                lng: e.geometry.location.lng()
            }
        }
    })

}
const handleSelectLocation = () => {
    if (location.destination.name) {
        router.push({
            name: 'map'
        })
    }

}
</script>