// 对axios进行二次封装
import axios from 'axios'

// 引入进度条
import nprogress from 'nprogress'
// 引入进度条样式
import 'nprogress/nprogress.css'

/*1、利用axios对象的create方法创建一个axios实例
2、request就是axios，这里只是稍微配置一下*/
const request = axios.create({
    // 配置对象

    // 基础路径
    baseURL: 'http://localhost:9090',

    // 请求超时的时间：5s
    timeout: 5000,
    // withCredentials: true
})

// 请求拦截器
request.interceptors.request.use(config => {
    // 进度条开始
    nprogress.start()
    // config：配置对象，有一个重要的属性（header 请求头）
    // config.headers.isAdmin = true
    return config
})
// 响应拦截器
request.interceptors.response.use(response => {
    // 响应成功的回调函数：服务器响应数据回来后，响应拦截器可以检测到，并且做一些事情
    // 进度条结束
    nprogress.done()
    return response.data
}, error =>{
    // 响应失败的回调函数
    return Promise.reject(new Error('failure'))
})

// 对外暴露
export default request