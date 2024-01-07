import axios from "axios"

const http = ()=>{
    let options = {
        baseURL:'http://127.0.0.1:8000',
        headers:{
        'Authorization':'',
        'Content-Type':'application/json',
        }
    }
    if (localStorage.getItem('token')) {
        let t =localStorage.getItem('token')
        options.headers.Authorization = 'Bearer '+t
    }
    return axios.create(options)
}
export default http