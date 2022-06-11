import request from "@/package/utils/request"

const baseUrl = '/system/role'

/**
 * 分页查询用户列表
 * @param {*} role 查询参数
 * @param {*} current 当前页（可为空）
 * @param {*} size 没页条数（可为空）
 */
export function getSysRolePage(role,current,size){
    return request.post(`${baseUrl}/getPage?current=${current || ''}&size=${size || ''}`,role || {})
}


/**
 * 新增和编辑角色
 * @param {*} role 角色参数，每条数据如果有roleId则为修改，roleId为null则为新增
 */
export function saveSysRole(role){
    return request.post(`${baseUrl}/saveRole`,role)
}


/**
 * 批量删除角色
 * @param {*} roleIds 角色的id列表
 * @returns 删除成功的数量
 */
export function deleteRoles(roleIds){
    return request.post(`${baseUrl}/deleteRoles`,roleIds)
}