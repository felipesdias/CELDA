import axios from 'axios';
import { SessionStorage } from 'quasar'

export default ({ Vue }) => {
    const http = axios.create({
        baseURL: 'http://127.0.0.1:3333',
        headers: {
            Accept: 'application/json'
        },
        responseType: 'json',
    });

    http.interceptors.request.use(
        config => {
            if (SessionStorage.get.item('token'))
                config.headers.Authorization = `Bearer ${SessionStorage.get.item('token')}`;
  
            return config;
        },
        error => Promise.reject(error)
    );

    http.interceptors.response.use(
        response => response.data,
        error => Promise.reject(error)
    );

    Vue.prototype.$axios = http;
};