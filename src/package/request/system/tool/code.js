import request from "@/package/utils/request"

const baseUrl = '/system/tool/code'

/**
 * 分页查询列表
 * @param {*} sysToolCode 查询参数
 * @param {*} current 当前页（可为空）
 * @param {*} size 没页条数（可为空）
 */
export function getSysToolCodePage(sysToolCode,current,size){
    return request.post(`${baseUrl}/getPage?current=${current || ''}&size=${size || ''}`,sysToolCode || {})
}


/**
 * 新增和编辑
 */
export function saveSysToolCode(sysToolCode){
    return request.post(`${baseUrl}/save`,sysToolCode)
}


/**
 * 批量删除
 * @param {*} sysToolCodeIds id列表
 * @returns 删除成功的数量
 */
export function deleteSysToolCodes(sysToolCodeIds){
    return request.post(`${baseUrl}/delete`,sysToolCodeIds)
}       