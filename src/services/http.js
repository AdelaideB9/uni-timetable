import axios from 'axios'
import store from '@/store'

const http = axios.create()

http.interceptors.request.use(config => {
    store.commit('START_LOADING')
    return config
}, error => {
    store.commit('FAIL_LOADING')
    return Promise.reject(error)
})

http.interceptors.response.use(response => {
    store.commit('FINISH_LOADING')
    return response
}, error => {
    store.commit('FAIL_LOADING')
    return Promise.reject(error)
})

export default http