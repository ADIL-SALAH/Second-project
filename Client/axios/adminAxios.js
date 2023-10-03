import axios from "axios";
import { adminApi } from "../constants/server";
import Cookies from "js-cookie";


const adminAxios = axios.create({
    baseURL: adminApi
})
adminAxios.interceptors.request.use((config) => {
    // add token to request headers
    config.headers['Authorization'] = Cookies.get('adminToken');
    return config;
});


export default adminAxios