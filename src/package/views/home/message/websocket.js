
import { message } from "antd";

let webSocket = null

/**
 * websocket建立连接
 */
export function wsOpen(onmessage) {
    if (!window.WebSocket) {
        message.warning("该环境不支持websocket")
        return
    }
    if(!onmessage && webSocket.onmessage){
        onmessage = webSocket.onmessage
    }
    let baseUrl = process.env.REACT_APP_HTTP_URL.replace("http://", "")
    baseUrl = baseUrl.replace("https://", "")
    //建立长链接，地址为你的服务端地址且以ws开头，以WebSocketConfig配置中的路径 .addHandler(myHandler(), "/ws")结尾
    //如果服务端有配置上下文 context-path，需要加入路径
    webSocket = new WebSocket(`ws://${baseUrl}/ws?${process.env.REACT_APP_HTTP_HEADER}=${localStorage.getItem(process.env.REACT_APP_HTTP_HEADER)}`);
    webSocket.onerror = () => {
        message.error("WebSocket连接失败")
    }
    webSocket.onmessage = onmessage

    window.addEventListener("close", wsClose)

}


/**
 * websocket关闭连接
 */
export function wsClose() {
    if(webSocket && webSocket.readyState === 1){
        webSocket.close()
    }
}


/**
 * 发送消息
 */
export function wsSend(msg){
    if(!webSocket){
        message.warning("未连接")
        return
    }
    if(webSocket.readyState === 3){
        message.warning("连接已断开，正在重连")
        wsOpen()
        return
    }
    if(msg.sendBy && msg.sendTo && msg.type && msg.content){
        webSocket.send(JSON.stringify(msg))
    }else{
        message.warning("发送失败")
    }
}