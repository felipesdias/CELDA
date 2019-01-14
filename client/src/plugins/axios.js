import axios from 'axios';
import { SessionStorage, Notify } from 'quasar'

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
        error => {
            if(error && error.response && error.response.status === 401) {
                SessionStorage.clear();
                Notify.create({
                    message: 'Não autorizado!',
                });
            }
            else if(error && error.response && error.response.data &&  error.response.data.informar) {
                Notify.create({
                    message: error.response.data.informar,
                });
            }
            else if(error && error.response && error.response.data && Array.isArray(error.response.data)) {
                Notify.create({
                    message: error.response.data[0].message,
                });
            }
            else {
                Notify.create({
                    message: 'Erro interno do servidor!',
                });
            }

            return Promise.reject(error)
        }
    );

    Vue.prototype.$axios = http;
};