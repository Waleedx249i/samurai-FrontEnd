<template>
    <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0">
            <img class="self-center w-full mx-auto " src="../assets/samurai.png" alt="samurai">

            <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
                <form v-if="!witingForVerify" class="space-y-4  flex-col content-around flex md:space-y-6"
                    @submit.prevent="login">
                    <div>
                        <label for="name" class="block mb-2 text-sm font-medium text-gray-900 ">Your
                            name</label>
                        <input type="text" v-model="data.name" id="name"
                            class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                            placeholder="your name" required="">
                    </div>
                    <div>
                        <label for="phone" class="block  text-sm font-medium text-gray-900">phone</label>
                        <input type="text" v-maska data-maska="+(###) #########" v-model="data.phone" id="phone"
                            placeholder="+(###) #########"
                            class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                            required="">
                    </div>

                    <div class="w-full flex-row flex justify-around  "><button type="submit" @submit.prevent="login"
                            class="w-1/2 mt-4  text-white bg-indigo-900 hover:bg-indigo-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                            login
                        </button></div>

                </form>
                <form v-else class="space-y-4 md:space-y-6" @submit.prevent="verify">

                    <div>
                        <label for="loginCode" class="block mb-2 text-sm font-medium text-gray-900 ">login
                            Code</label>
                        <input type="text" v-maska data-maska="######" v-model="data.loginCode" id="loginCode"
                            placeholder="######"
                            class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                            required="">
                    </div>
                    <button type="submit" @submit.prevent="verify"
                        class="w-full text-white bg-blue-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                        verify
                    </button>

                </form>
            </div>
        </div>
    </div>
</template>
<script setup>
import { onMounted, reactive, ref } from 'vue'
import axios from 'axios'
import { vMaska } from "maska"
import { useRouter } from 'vue-router';

const router = useRouter()
onMounted(() => {
    if (localStorage.getItem('token')) {
        router.push({
            name: 'landing'
        })
    }
})
const witingForVerify = ref(false)
const data = reactive({
    phone: null,
    name: null,
    loginCode: null
})
const login = () => {
    axios.post('http://127.0.0.1:8000/api/login', {
        phone: data.phone.replace(/[\s\p{P}]/gu, ''),
        name: data.name
    }).then((response) => {
        alert(response.data.message)
        witingForVerify.value = true

    }).catch((error) => {
        console.error(error);
        alert(error.response.data.message)
    })
}
const verify = () => {
    axios.post('http://127.0.0.1:8000/api/login/verify', {
        phone: data.phone.replace(/[\s\p{P}]/gu, ''),
        login_code: data.loginCode
    }).then((response) => {
        localStorage.setItem('token', response.data)
        alert(localStorage.getItem('token'))
        router.push({
            name: 'landing'
        })
    }).catch((error) => {
        console.error(error);
        alert(error.response.data.message)
    })
}

</script>