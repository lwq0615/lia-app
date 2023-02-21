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
 * 查询路由树
 */
 export function getSysRouterTree(){
    return request.get(`${baseUrl}/getRouterTree`)
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


/**
 * 根据id查询路由
 */
export function getRouterById(routerId){
    return request.get(`${baseUrl}/getRouterById?routerId=${routerId}`)
}


/**
 * 路由重新排序
 */
export function reloadIndex(list){
    return request.post(`${baseUrl}/reloadIndex`, list)
}