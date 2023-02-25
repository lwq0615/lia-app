/* eslint-disable */
import axios from "axios"
import { message } from 'antd'
import { router } from "../router"


const request = axios.create({
    baseURL: process.env.REACT_APP_HTTP_URL,
    timeout: 60000,
    headers: {
        "Content-Type": "application/json"
    }
})

/**
 * 在发送请求前携带token
 */
request.interceptors.request.use(config => {
    const token = localStorage.getItem(process.env.REACT_APP_HTTP_HEADER)
    if (token) {
        config.headers[process.env.REACT_APP_HTTP_HEADER] = token
    }
    return config
})


/**
 * 防止消息提示重复
 */
const msgMap = {}


/**
 * 生成消息提示弹窗
 * @param {*} errCode 错误状态码
 * @returns 
 */
function createMsg(errCode, msg) {
    // 已经有该消息则不重复提示
    if (!msgMap[errCode] || errCode === 403) {
        msgMap[errCode] = true
        message.warning(msg, 3, () => {
            delete msgMap[errCode]
        })
    }
    if ([401, 402].includes(errCode)) {
        localStorage.removeItem(process.env.REACT_APP_HTTP_HEADER)
        router.navigate("/login")
    }
}


/**
 * 对不同的http返回状态码进行处理
 */
request.interceptors.response.use(
    res => {
        if(res.data.code === 200){
            return res.data.data
        }else{
            createMsg(res.data.code, res.data.message)
            return Promise.reject(res.data)
        }
    },
    err => {
        throw err
    }
)

export default request