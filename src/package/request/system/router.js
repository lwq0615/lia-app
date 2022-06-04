import request from "@/package/utils/request"

const baseUrl = '/system/router'

/**
 * 获取路由可访问的路由
 * @param {*} roleId 角色Id 
 * @returns 
 */
export function getRouterOfRole(roleId) {
    return request.get(`${baseUrl}/getRouterOfRole?roleId=${roleId || ''}`)
}


/**
 * 分页查询路由列表
 * @param {*} router 查询参数
 * @param {*} current 当前页（可为空）
 * @param {*} size 没页条数（可为空）
 */
 export function getSysRouterPage(router,current,size){
    return request.post(`${baseUrl}/getPage?current=${current || ''}&size=${size || ''}`,router || {})
}


/**
 * 新增和编辑路由
 * @param {*} router 路由参数，每条数据如果有userId则为修改，userId为null则为新增
 */
export function saveSysRouter(router){
    return request.post(`${baseUrl}/saveRouter`,router)
}


/**
 * 批量删除路由
 * @param {*} routerIds 路由的id列表
 * @returns 删除成功的数量
 */
export function deleteRouters(routerIds){
    return request.post(`${baseUrl}/deleteRouters`,routerIds)
}