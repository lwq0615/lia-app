import request from "@/package/utils/request"

const baseUrl = '/system/dict'

/**
 * 获取角色字典表
 * @returns {roleId: name,...}
 */
export function getRoleDict() {
    return request.get(`${baseUrl}/sysRoleDict`)
}

/**
 * 获取性别字典表
 */
export function getSexDict(){
    return request.get(`${baseUrl}/getSysDict?type=sys:sex`)
}

/**
 * 获取用户字典表
 * @returns 
 */
export function getUserDict(){
    return request.get(`${baseUrl}/sysUserDict`)
}