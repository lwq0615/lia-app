/* eslint-disable */
import axios from "axios"
import { http } from "@/config"
import { message } from 'antd'


/**
 * 路由跳转的钩子函数
 */
let navigate = null


/**
 * 在应用初始化时注册路由跳转钩子函数
 */
export function initRouter(initNavigate){
    navigate = initNavigate
}


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
    if (token) {
        config.headers[http.header] = token
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
function createMsg(errCode) {
    const msgText = {
        400: "请求有误",
        401: "请先登录",
        402: "登录过期，请重新登录",
        403: "没有权限",
        404: "目标资源不存在",
        405: "请求类型有误",
        500: "服务器内部错误"
    }
    // 已经有该消息则不重复提示
    if (!msgMap[errCode]) {
        msgMap[errCode] = true
        message.warning(msgText[errCode] || "未知错误", 3, () => {
            delete msgMap[errCode]
        })
    }
    if ([401, 402].includes(errCode)) {
        localStorage.removeItem(http.header)
        navigate("/login")
    }
}

/**
 * 对不同的http返回状态码进行处理
 */
request.interceptors.response.use(
    res => {
        return res.data;
    },
    err => {
        createMsg(err.response.status)
        return Promise.reject(err)
    }
)

export default request