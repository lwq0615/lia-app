import request from "@/package/utils/request"

const baseUrl = '/system/dictType'

/**
 * 分页查询列表
 * @param {*} sysDictType 查询参数
 * @param {*} current 当前页（可为空）
 * @param {*} size 没页条数（可为空）
 */
export function getSysDictTypePage(sysDictType,current,size){
    return request.post(`${baseUrl}/getPage?current=${current || ''}&size=${size || ''}`,sysDictType || {})
}


/**
 * 新增和编辑
 */
export function saveSysDictType(sysDictType){
    return request.post(`${baseUrl}/save`,sysDictType)
}


/**
 * 批量删除
 * @param {*} sysDictTypeIds id列表
 * @returns 删除成功的数量
 */
export function deleteSysDictTypes(sysDictTypeIds){
    return request.post(`${baseUrl}/delete`,sysDictTypeIds)
}          