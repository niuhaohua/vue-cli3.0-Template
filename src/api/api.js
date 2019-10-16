// 配置API接口地址
var root = ''
// 引用axios
import axios from 'axios'
import Qs from 'qs'
import store from '../store/index'
import {
    getToken,
    setToken,
    removeToken
} from '@/utils/token'
import {
    Message,
    MessageBox
} from 'element-ui'
// 自定义判断元素类型JS
function toType(obj) {
    return toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
}
// 参数过滤函数
function filterNull(o) {
    for (var key in o) {
        if (o[key] === null) {
            delete o[key]
        }
        if (toType(o[key]) === 'string') {
            o[key] = o[key].trim()
        } else if (toType(o[key]) === 'object') {
            o[key] = filterNull(o[key])
        } else if (toType(o[key]) === 'array') {
            o[key] = filterNull(o[key])
        }
    }
    return o
}

axios.defaults.withCredentials = true

axios.interceptors.request.use(function (config) {
    if (getToken('ht-token')) {
        config.headers['Authorization'] = 'Bearer ' + getToken('ht-token')
    }
    return config
}, function (error) {
    return Promise.reject(error)
})


function apiAxios(method, url, params, success, failure, type) {
    if (params) {
        params = filterNull(params)
    }
    axios({
            baseURL: '/asadms', // api 的 base_url
            timeout: 5000, // request timeout,
            method: method,
            url: url,
            data: method === 'PUT' || method === 'POST' ? Qs.stringify(params) : null,
            params: method === 'GET' || method === 'DELETE' ? params : null,
            withCredentials: false
        })
        .then(function (res) {
            if (res.status === 200) {
                if (res.data.code === 200 && success) {
                    // if(res.data.data){
                        success(res.data)
                    // }
                } else if (res.data.code === 401) {
                    if (res.config.url == '/asadms/refreshToken') {
                        store.dispatch('user/logout').then(() => {
                            location.reload()
                        })
                    } else {
                        store.dispatch('user/resetToken').then((res) => {
                            if (res.code === 200) {
                                setToken('ht-token', res.data.access_token)
                                setToken('ht-refreshtoken', res.data.refresh_token)
                            }
                        }, )
                    }
                } else {
                    Message({
                        type: 'error',
                        message: res.data.data || res.data.msg || res.data.resMsg
                    })
                }
            } else {
                Message({
                    type: 'error',
                    message: res.data.msg || res.data.resMsg
                })
            }
        })
        .catch(function (err) {
            Message({
                type: 'error',
                message: err
            })
        })
}

// 返回在vue模板中的调用接口
export default {
    get: function (url, params, success, failure) {
        return apiAxios('GET', url, params, success, failure)
    },
    post: function (url, params, success, failure) {
        return apiAxios('POST', url, params, success, failure)
    },
    put: function (url, params, success, failure) {
        return apiAxios('PUT', url, params, success, failure)
    },
    delete: function (url, params, success, failure) {
        return apiAxios('DELETE', url, params, success, failure)
    }
}