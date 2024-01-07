<template>
    <div class="pt-12">

        <div>
            <div class="max-w-sm mx-auto overflow-hidden text-left shadow-2xl shadow-gray-950 sm:rounded-md">
                <img class="self-center w-3/4 mx-auto " src="../assets/samurai.png" alt="samurai">


                <div class="px-3 py-1 bg-white  sm:p-6">
                    <p class="text-gray-700 text-sm text-center mb-3 mx-auto ">intput your car info </p>
                    <form @submit.prevent="handleSaveDriver" class="h-1/2 flex flex-col content-center" action="">

                        <input required v-model="driverInfo.yaer"
                            class="bg-gray-50 border mb-5 border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-400 focus:border-primary-300 block w-full p-2"
                            type="number" placeholder="yaer" name="yaer" id="yaer">
                        <input required v-model="driverInfo.make"
                            class="bg-gray-50 border mb-5 border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-400 focus:border-primary-300 block w-full p-2"
                            type="text" placeholder="make" name="make" id="make">
                        <input required v-model="driverInfo.model"
                            class="bg-gray-50 border mb-5 border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-400 focus:border-primary-300 block w-full p-2"
                            type="text" placeholder="model" name="model" id="model">
                        <input required v-model="driverInfo.color"
                            class="bg-gray-50 border mb-5 border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-400 focus:border-primary-300 block w-full p-2"
                            type="text" placeholder="color" name="color" id="color">
                        <input required v-model="driverInfo.license_plate"
                            class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-400 focus:border-primary-300 block w-full p-2"
                            type="text" placeholder="license plate" name="license_plate" id="license_plate">

                        <button @submit.prevent="handleSaveDriver" type="submit"
                            class="mx-auto  my-3 text-center px-4 py-2 text-sm font-medium text-white bg-indigo-900 border border-transparent rounded-md shadow-sm hover:bg-indigo-600 focus:outline-none">
                            save info</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { reactive } from 'vue';
import http from '../helpers/http';
import { useRouter } from 'vue-router';

const router = useRouter()
const driverInfo = reactive({
    'yaer': null,
    'make': '',
    'model': '',
    'color': '',
    'license_plate': '',
})
const handleSaveDriver = () => {
    http().post('/api/driver', driverInfo)
        .then((response) => {
            console.log(response.data)
            router.push({
                name: 'standBy'
            })
        })
        .catch((error) => {
            console.error(error.message)
        })
}
</script>