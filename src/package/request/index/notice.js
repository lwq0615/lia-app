
import request from "@/package/utils/request"

const baseUrl = '/system/notice'

/**
 * 分页查询列表
 * @param {*} sysNotice 查询参数
 * @param {*} current 当前页（可为空）
 * @param {*} size 没页条数（可为空）
 */
export function getSysNoticePage(sysNotice,current,size){
    return request.post(`${baseUrl}/getPage?current=${current || ''}&size=${size || ''}`,sysNotice || {})
}


/**
 * 新增
 */
export function addSysNotice(sysNotice){
    return request.post(`${baseUrl}/add`,sysNotice)
}


/**
 * 编辑
 */
export function editSysNotice(sysNotice){
    return request.post(`${baseUrl}/edit`,sysNotice)
}


/**
 * 批量删除
 * @param {*} sysNoticeIds id列表
 * @returns 删除成功的数量
 */
export function deleteSysNotices(sysNoticeIds){
    return request.post(`${baseUrl}/delete`,sysNoticeIds)
}               


/**
 * 获取公告相关附件
 * @param {*} noticeId 公告id
 */
export function getFilesOfNotice(noticeId){
    return request.post(`${baseUrl}/getFilesOfNotice`,noticeId)
}

/**
 * 获取公告相关角色
 * @param {*} noticeId 公告id
 */
export function getRolesOfNotice(noticeId){
    return request.post(`${baseUrl}/getRolesOfNotice`,noticeId)
}