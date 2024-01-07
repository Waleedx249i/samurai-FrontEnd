<template>
    <div class="pt-16">

        <div class="max-w-sm mx-auto overflow-hidden text-left shadow sm:rounded-md">
            <div class="px-4 py-5 bg-white sm:p-6">
                <img class="self-center w-full mx-auto " src="../assets/samurai.png" alt="samurai">

                <div class="flex justify-between mt-7">
                    <button @click="handleStartDriving"
                        class="px-4 py-2 text-sm font-medium text-white bg-indigo-900 border border-transparent rounded-md shadow-sm hover:bg-indigo-400 focus:outline-none">
                        Start Driving
                    </button>
                    <button @click="handleFindARide"
                        class="px-4 py-2 text-sm font-medium text-white bg-indigo-900 border border-transparent rounded-md shadow-sm hover:bg-indigo-400 focus:outline-none">
                        Find A Ride
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup >
import { useRouter } from 'vue-router'
import http from '../helpers/http';


const router = useRouter()
const handleFindARide = () => {
    router.push('location')
}
const handleStartDriving = () => {
    http().get('/api/driver').then((response) => {
        console.log(response)
        if (response.data.driver) {
            router.push('standBy')
        }
        else {
            router.push('driver')
        }
    })

}

</script>