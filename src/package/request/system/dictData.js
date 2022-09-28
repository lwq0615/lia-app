
import request from "@/package/utils/request"

const baseUrl = '/system/dictData'

/**
 * 分页查询列表
 * @param {*} sysDictData 查询参数
 * @param {*} current 当前页（可为空）
 * @param {*} size 没页条数（可为空）
 */
export function getSysDictDataPage(sysDictData,current,size){
    return request.post(`${baseUrl}/getPage?current=${current || ''}&size=${size || ''}`,sysDictData || {})
}


/**
 * 新增和编辑
 */
export function saveSysDictData(sysDictData){
    return request.post(`${baseUrl}/save`,sysDictData)
}


/**
 * 批量删除
 * @param {*} sysDictDataIds id列表
 * @returns 删除成功的数量
 */
export function deleteSysDictDatas(sysDictDataIds){
    return request.post(`${baseUrl}/delete`,sysDictDataIds)
}           



/**
 * 获取性别字典表
 */
export function getSexDict(){
    return request.get(`${baseUrl}/getSexDict`)
}


/**
 * 获取角色状态字典表
 */
export function getUserStatusDict(){
    return request.get(`${baseUrl}/getUserStatusDict`)
}