/* eslint-disable */
import axios, { AxiosRequestConfig, AxiosInstance } from "axios"
import { message } from 'antd'
import { router } from "../router"


// R是响应的类型，D是请求data的类型
interface Request extends AxiosInstance {
    request<R = any, D = any>(config: AxiosRequestConfig<D>): Promise<R>;
    get<R = any, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<R>
    delete<R = any, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<R>
    post<R = any, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<R>
    put<R = any, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<R>
}

const request: Request = axios.create({
    baseURL: process.env.REACT_APP_HTTP_URL,
    timeout: 60000,
    headers: {
        "Content-Type": "application/json"
    }
})

/**
 * 在发送请求前携带token
 */
request.interceptors.request.use((config: AxiosRequestConfig) => {
    const token = localStorage.getItem(process.env.REACT_APP_HTTP_HEADER as string)
    if (token) {
        config.headers && (config.headers[process.env.REACT_APP_HTTP_HEADER as string] = token)
    }
    return config
})


/**
 * 防止消息提示重复
 */
const msgMap: {
    [code: number]: boolean
} = {}


/**
 * 生成消息提示弹窗
 * @param {*} errCode 错误状态码
 * @returns 
 */
function createMsg(errCode: number, msg: string) {
    // 已经有该消息则不重复提示
    if (!msgMap[errCode] || errCode === 403) {
        msgMap[errCode] = true
        message.warning(msg, 3, () => {
            delete msgMap[errCode]
        })
    }
    if ([401, 402].includes(errCode)) {
        localStorage.removeItem(process.env.REACT_APP_HTTP_HEADER as string)
        router && (router as any).navigate("/login")
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