
import request from "@/package/utils/request"

const baseUrl = '/system/param'

/**
 * 分页查询列表
 * @param {*} sysParam 查询参数
 * @param {*} current 当前页（可为空）
 * @param {*} size 没页条数（可为空）
 */
export function getSysParamPage(sysParam,current,size){
    return request.post(`${baseUrl}/getPage?current=${current || ''}&size=${size || ''}`,sysParam || {})
}


/**
 * 新增和编辑
 */
export function saveSysParam(sysParam){
    return request.post(`${baseUrl}/save`,sysParam)
}


/**
 * 批量删除
 * @param {*} sysParamIds id列表
 * @returns 删除成功的数量
 */
export function deleteSysParams(sysParamIds){
    return request.post(`${baseUrl}/delete`,sysParamIds)
}               


/**
 * 根据参数名获取参数值
 */
export function getParamValue(name){
    return request.get(`${baseUrl}/getParamValue?name=${name}`)
}