
import axios from 'axios'
import { userApi } from '../constants/server'
import Cookies from 'js-cookie';


const userAxios = axios.create({
    baseURL: userApi
});
// request interceptor for adding token
userAxios.interceptors.request.use((config) => {
    // add token to request headers
    config.headers['Authorization'] = Cookies.get('token');
    return config;
});


export default userAxios
