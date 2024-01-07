import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import loginView from '../views/loginView.vue'
import LandingView from '../views/LandingView.vue'
import LocationView  from "../views/LocationView.vue";
import MapView  from "../views/MapView.vue";
import TripView  from "../views/TripView.vue";
import DriverView  from "../views/DriverView.vue";
import StandByView  from "../views/StandByView.vue";
import DrivingView from "../views/DrivingView.vue"
import http from "../helpers/http";
import axios from 'axios'



const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/login',
      name: 'login',
      component: loginView
    },
    {
      path:'/landing',
      name:'landing',
      component:LandingView
    },
    {
      path:'/location',
      name:'location',
      component:LocationView
    },
    {
      path:'/map',
      name:'map',
      component:MapView
    },
    {
      path:'/trip',
      name:'trip',
      component:TripView
    },
    {
      path:'/driver',
      name:'driver',
      component:DriverView
    },
    {
      path:'/standBy',
      name:'standBy',
      component:StandByView
    },
    {
      path:'/Driving',
      name:'driving',
      component:DrivingView
    },

    
  ]
})
const token =localStorage.getItem('token')
const chekTokenAuthenticity =()=>{
  http().get('/api/user')
  .then((response)=>{true})
  .catch((error)=>{
    if(error.response.status==401){
      localStorage.removeItem('token')
      return {name:'login'}
    }
    
    console.log(error)
    
  })
}
router.beforeEach((to,from)=>{
  if (to.name=='login') {
    return true
  }
  if (!localStorage.getItem('token')) {
    return {name :'login'}
   
  }
  chekTokenAuthenticity()
})

export default router
