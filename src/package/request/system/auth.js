import request from "@/package/utils/request"

const baseUrl = '/system/auth'

/**
 * 分页查询权限列表
 * @param {*} auth 查询参数
 * @param {*} current 当前页（可为空）
 * @param {*} size 没页条数（可为空）
 */
export function getSysAuthPage(auth,current,size){
    return request.post(`${baseUrl}/getPage?current=${current || ''}&size=${size || ''}`,auth || {})
}


/**
 * 新增和编辑权限
 * @param {*} auth 权限参数，每条数据如果有authId则为修改，authId为null则为新增
 */
export function saveSysAuth(auth){
    return request.post(`${baseUrl}/save`,auth)
}


/**
 * 批量删除权限
 * @param {*} authIds 权限的id列表
 * @returns 删除成功的数量
 */
export function deleteAuths(authIds){
    return request.post(`${baseUrl}/delete`,authIds)
}

/**
 * 获取权限字典表
 */
export function getAuthDict(){
    return request.get(`${baseUrl}/sysAuthDict`)
}