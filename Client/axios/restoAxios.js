import axios from "axios";
import { restoApi } from "../constants/server";
import Cookies from "js-cookie";

const restoAxios = axios.create({
    baseURL: restoApi
})

restoAxios.interceptors.request.use((config) => {
    // add token to request headers
    config.headers['Authorization'] = Cookies.get('restoToken');
    return config;
});

export default restoAxios
