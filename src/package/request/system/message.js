import request from "@/package/utils/request"

const baseUrl = '/system/message'

/**
 * 分页查询消息列表
 * @param {*} current 当前页（可为空）
 * @param {*} size 没页条数（可为空）
 */
export function getMsgRecordPage(message,current,size){
    return request.post(`${baseUrl}/getPage?current=${current || ''}&size=${size || ''}`,message || {})
}

/**
 * 获取可以聊天的用户（只有相同企业的用户可以相互聊天）
 */
export function getPersonList(){
    return request.get(`${baseUrl}/personList`)
}


/**
 * 未读聊天记录数量
 */
 export function getNoReadCount(){
    return request.get(`${baseUrl}/getNoReadCount`)
}

/**
 * 最后一条聊天记录
 */
 export function getLastMsg(userIds){
    return request.post(`${baseUrl}/getLastMsg`, userIds)
}