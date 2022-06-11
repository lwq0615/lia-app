import request from "@/package/utils/request"

const baseUrl = '/system/power'

/**
 * 分页查询权限列表
 * @param {*} power 查询参数
 * @param {*} current 当前页（可为空）
 * @param {*} size 没页条数（可为空）
 */
export function getSysPowerPage(power,current,size){
    return request.post(`${baseUrl}/getPage?current=${current || ''}&size=${size || ''}`,power || {})
}


/**
 * 新增和编辑权限
 * @param {*} power 权限参数，每条数据如果有powerId则为修改，powerId为null则为新增
 */
export function saveSysPower(power){
    return request.post(`${baseUrl}/save`,power)
}


/**
 * 批量删除权限
 * @param {*} powerIds 权限的id列表
 * @returns 删除成功的数量
 */
export function deletePowers(powerIds){
    return request.post(`${baseUrl}/delete`,powerIds)
}