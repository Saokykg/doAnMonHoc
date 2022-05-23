import axios from 'axios'
import cookies from "react-cookies"

export let endpoints = {
    'oauthinfo':'/oauthinfo/',
    'benxe': '/benxe/',
    'login': '/o/token/',
    'users': '/users/',
    'current-user':'/users/current_user/',
    'costumer-register': '/users/register/',
    'costumer-info':'/costumer/signin',
    'check-email':'/khachhang/check_email/',
    'check-username':'/users/check_username/',
    'chuyenxe':'/chuyenxe/',
    'benxedau':'/tuyenduong/bendau/',
    'benxecuoi':'/tuyenduong/bencuoi/',
    'giochay':'/chuyenxe/giochay/',
    'tuyenduong':'/tuyenduong/',
    'khachhanginfo':'/khachhang/cur_costumer/',
    'khachhang':'/khachhang/',
    'taixe':'/taixe/',
    'banve':'/nhanvienbanve/',
    "nhanvien":'/nhanvien/',
    "modelxe":'/modelxe/',
    "xe":'/xe/',
    "tram":'/tramdung/',
    "giave":'/giave/',
    "thongke":'/thongke/'
    // "binhluan":'/binhluan/'
}
console.log(cookies.load("access_token"))

const API = axios.create({
    baseURL: "http://127.0.0.1:8000/"
})

API.interceptors.request.use(async (config) =>{
    const auth = cookies.load("access_token")
    if (auth)
        config.headers["Authorization"] = auth


    return config;
})

API.interceptors.response.use(async (res) =>{
    
    if (res?.data?.access_token){
        cookies.remove("access_token")
        cookies.save("access_token", `Bearer ${res?.data?.access_token}`)
    }
    return res;
},
(error) =>{
    console.log("API call failed: ", error);
    return Promise.reject(error.message);
})






export default API;