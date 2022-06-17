import request from "@/package/utils/request"

const baseUrl = '/system/user'

/**
 * 用户登录
 * @param {*} user 
 * @returns 
 */
export function sysUserLogin(user) {
    return request.post(`${baseUrl}/login`, user)
}

/**
 * 获取用户信息
 * @returns 
 */
export function getSysUserInfo() {
    return request.get(`${baseUrl}/getInfo`)
}


/**
 * 分页查询用户列表
 * @param {*} user 查询参数
 * @param {*} current 当前页（可为空）
 * @param {*} size 没页条数（可为空）
 */
export function getSysUserPage(user,current,size){
    return request.post(`${baseUrl}/getPage?current=${current || ''}&size=${size || ''}`,user || {})
}


/**
 * 新增和编辑用户
 * @param {*} user 用户参数，每条数据如果有userId则为修改，userId为null则为新增
 */
export function saveSysUser(user){
    return request.post(`${baseUrl}/saveUser`,user)
}


/**
 * 批量删除用户
 * @param {*} userIds 用户的id列表
 * @returns 删除成功的数量
 */
export function deleteUsers(userIds){
    return request.post(`${baseUrl}/deleteUsers`,userIds)
}


/**
 * 获取用户头像地址
 */
export function getHeadImg(){
    return request.get(`${baseUrl}/getHeadImg`)
}


/**
 * 更换用户头像
 */
 export function updateHeadImg(file, fileId){
    const formData = new FormData();
    formData.append("file", file)
    formData.append("fileId", fileId)
    return request.post(`${baseUrl}/updateHeadImg`,formData, {
        "Content-Type": false
    })
}