import request from "@/package/utils/request"

const baseUrl = '/system/router'

/**
 * 用户登录
 * @param {*} user 
 * @returns 
 */
export function getRouterOfRole(roleId) {
    return request.get(`${baseUrl}/getRouterOfRole?roleId=${roleId || ''}`)
}