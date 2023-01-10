
import request from "@/package/utils/request"

const baseUrl = '/system/register/code'

/**
 * 分页查询列表
 * @param {*} sysRegisterCode 查询参数
 * @param {*} current 当前页（可为空）
 * @param {*} size 没页条数（可为空）
 */
export function getSysRegisterCodePage(sysRegisterCode,current,size){
    return request.post(`${baseUrl}/getPage?current=${current || ''}&size=${size || ''}`,sysRegisterCode || {})
}


/**
 * 编辑
 */
export function editSysRegisterCode(sysRegisterCode){
    return request.post(`${baseUrl}/edit`,sysRegisterCode)
}


/**
 * 批量删除
 * @param {*} sysRegisterCodeIds id列表
 * @returns 删除成功的数量
 */
export function deleteSysRegisterCodes(sysRegisterCodeIds){
    return request.post(`${baseUrl}/delete`,sysRegisterCodeIds)
}               
