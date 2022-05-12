/* eslint-disable */
import axios from "axios"
import { http } from "../../config"
import { message } from 'antd'



const request = axios.create({
    baseURL: http.baseUrl,
    timeout: 60000,
    headers: {
        "Content-Type": "application/json"
    }
})

/**
 * 路由守卫
 * 在发送请求前携带token
 */
request.interceptors.request.use(config => {
    const token = localStorage.getItem(http.header)
    if(token){
        config.headers[http.header] = token
    }
    return config  
})

/**
 * 对不同的http返回状态码进行处理
 */
request.interceptors.response.use(
    res => {
        return res.data;
    },
    err => {
        switch (err.response.status){
            case 401:{
                location.href = "/login"
                message.warning('请先登录')
                break
            }
            case 402:{
                location.href = "/login"
                message.warning('登录过期，请重新登录')
                break
            }
            case 403:{
                message.error('没有权限')
                break
            }
            case 404:{
                message.error("目标资源不存在")
                break
            }
            case 500:{
                message.error('服务器内部错误')
                break
            }
        }
        return Promise.reject(err)
    }
)

export default request