
import { http } from "@/config"
import { message } from "antd";

let webSocket = null

/**
 * websocket建立连接
 */
export function wsOpen() {
    if (!window.WebSocket) {
        message.warning("该环境不支持websocket")
        return
    }

    let baseUrl = http.baseUrl.replace("http://", "")
    baseUrl = baseUrl.replace("https://", "")
    //建立长链接，地址为你的服务端地址且以ws开头，以WebSocketConfig配置中的路径 .addHandler(myHandler(), "/ws")结尾
    //如果服务端有配置上下文 context-path，需要加入路径
    webSocket = new WebSocket(`ws://${baseUrl}/ws?${http.header}=${localStorage.getItem(http.header)}`);

    webSocket.onmessage = function (ev) {
        console.log(ev);
        console.log("收到消息");
    }

    webSocket.onopen = function (ev) {
        console.log("与服务器端的websocket连接建立");
    }
    webSocket.onclose = function (ev) {
        console.log("与服务器端的websocket连接断开");
    }

    window.addEventListener("close", wsClose)

}


/**
 * websocket关闭连接
 */
export function wsClose() {
    if(!webSocket){
        return
    }
    webSocket.close()
}